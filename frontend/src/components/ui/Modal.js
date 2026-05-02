export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-11/12 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-3 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-2 sm:mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4" id="modal-title">
                  {title}
                </h3>
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
