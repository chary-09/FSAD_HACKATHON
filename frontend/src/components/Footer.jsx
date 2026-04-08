export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 w-full py-12 px-8 border-t border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
        <div>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 font-headline">Bharat Airways</div>
          <p className="text-slate-500 font-manrope text-sm leading-relaxed">
            Connecting hearts and destinations with the spirit of India.
          </p>
        </div>
        <div className="flex flex-col space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider mb-2">
            Company
          </h4>
          <a className="text-slate-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 transition-colors duration-300 font-manrope text-sm">
            About Us
          </a>
          <a className="text-slate-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 transition-colors duration-300 font-manrope text-sm">
            Careers
          </a>
          <a className="text-slate-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 transition-colors duration-300 font-manrope text-sm">
            Fleet
          </a>
          <a className="text-slate-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 transition-colors duration-300 font-manrope text-sm">
            Sustainability
          </a>
        </div>
        <div className="flex flex-col space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider mb-2">
            Support
          </h4>
          <a className="text-slate-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 transition-colors duration-300 font-manrope text-sm">
            Contact
          </a>
          <a className="text-slate-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 transition-colors duration-300 font-manrope text-sm">
            FAQs
          </a>
          <a className="text-slate-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 transition-colors duration-300 font-manrope text-sm">
            Baggage Info
          </a>
          <a className="text-slate-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 transition-colors duration-300 font-manrope text-sm">
            Refund Policy
          </a>
        </div>
        <div className="flex flex-col space-y-3">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm uppercase tracking-wider mb-2">
            Legal
          </h4>
          <a className="text-slate-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 transition-colors duration-300 font-manrope text-sm">
            Privacy Policy
          </a>
          <a className="text-slate-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 transition-colors duration-300 font-manrope text-sm">
            Terms of Service
          </a>
          <a className="text-slate-500 hover:text-orange-500 underline decoration-orange-500 underline-offset-4 transition-colors duration-300 font-manrope text-sm">
            Legal
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 font-manrope text-sm">
        <p>© 2024 Bharat Airways. Elevating the Horizon.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <span className="material-symbols-outlined cursor-pointer hover:text-primary">public</span>
          <span className="material-symbols-outlined cursor-pointer hover:text-primary">mail</span>
          <span className="material-symbols-outlined cursor-pointer hover:text-primary">share</span>
        </div>
      </div>
    </footer>
  )
}
