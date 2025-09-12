import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/test-utils'
import BookDetailModal from '@/components/book-modal'

// Mock the action module first, before any imports
vi.mock('@/app/actions/reviews.action', () => {
  const mockFetchBookById = vi.fn()
  return {
    fetchBookById: mockFetchBookById,
  }
})

// Import the mocked function after the mock is defined
const mockFetchBookById = vi.mocked(await import('@/app/actions/reviews.action')).fetchBookById

// Mock NextAuth
const mockUseSession = vi.fn()
vi.mock('next-auth/react', () => ({
  useSession: mockUseSession,
}))

describe('Debug BookDetailModal', () => {
  const mockBook = {
    id: 'test-book-id',
    volumeInfo: {
      title: 'Initial Title',
      authors: ['Initial Author'],
    },
  }

  const mockProps = {
    book: mockBook,
    isOpen: true,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Configure the mock function to return our test data
    mockFetchBookById.mockResolvedValue({
      id: 'test-book-id',
      volumeInfo: {
        title: 'Test Book Title',
        authors: ['Test Author'],
        description: 'Test description',
        imageLinks: {
          large: 'https://example.com/large.jpg',
        },
      },
    })
    
    mockUseSession.mockReturnValue({
      data: {
        user: { id: 'test-user', email: 'test@example.com' },
      },
      status: 'authenticated',
    })

    // Setup fetch mock with vi.stubGlobal
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      console.log('Mock fetch called with:', url)
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    }))
  })

  it('should call fetchBookById when modal opens', async () => {
    render(<BookDetailModal {...mockProps} />)
    
    await waitFor(() => {
      expect(mockFetchBookById).toHaveBeenCalledWith('test-book-id')
    })

    // Let's also check the mock result
    const mockResult = await mockFetchBookById.mock.results[0].value
    console.log('Mock result:', mockResult)
  })

  it('should show book details after loading', async () => {
    render(<BookDetailModal {...mockProps} />)
    
    // Wait for the loading state to complete
    await waitFor(() => {
      expect(screen.queryByText('Cargando detalles del libro...')).not.toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Check if book details are shown
    await waitFor(() => {
      expect(screen.getByText('Test Book Title')).toBeInTheDocument()
    })
  })
})