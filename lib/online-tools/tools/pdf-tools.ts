import type { ToolDefinition } from '../types';

export const PDF_TOOLS: ToolDefinition[] = [
  {
    slug: 'merge-pdf',
    category: 'pdf-tools',
    name: 'Merge PDF',
    icon: '📚',
    shortDescription: 'Combine multiple PDF files into one.',
    description:
      'Merge PDF files into a single document in the order you choose. Drag files to reorder them, then download the combined PDF. Your documents are merged in your browser and never uploaded.',
    title: 'Merge PDF – Combine PDF Files Online, No Upload',
    metaDescription:
      'Merge PDF files online for free. Combine multiple PDFs into one, reorder them first, and download — processed in your browser, never uploaded.',
    keywords: [
      'merge pdf',
      'combine pdf',
      'join pdf',
      'pdf merger',
      'merge pdf files',
    ],
    relatedTools: [
      'split-pdf',
      'reorder-pdf-pages',
      'compress-pdf',
      'extract-pdf-pages',
      'image-converter',
    ],
    component: 'pdf-merge',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Add two or more PDF files (you can add more at any time).',
      'Use the arrow buttons to put them in the right order.',
      'Click “Merge PDFs” and download the combined file.',
    ],
    about: [
      'Merging copies every page of each PDF into one new document, preserving text, images, links and page sizes. It is useful for combining invoices, scanned pages, chapters or application documents into a single file.',
      'Because everything runs locally, it is safe to merge contracts, bank statements and other confidential documents.',
    ],
    faqs: [
      {
        q: 'Is there a file size or page limit?',
        a: 'There is no fixed limit. Very large PDFs (hundreds of MB) depend on the memory available in your browser.',
      },
      {
        q: 'Can I merge password-protected PDFs?',
        a: 'No — encrypted PDFs need to be unlocked with their password first.',
      },
    ],
  },
  {
    slug: 'split-pdf',
    category: 'pdf-tools',
    name: 'Split PDF',
    icon: '✂️',
    shortDescription: 'Split a PDF into several smaller files.',
    description:
      'Split a PDF into separate files — every page on its own, every N pages, or by custom ranges such as 1-3, 4-10. The split happens in your browser; your PDF is never uploaded.',
    title: 'Split PDF – Separate PDF Pages Online, Free & Private',
    metaDescription:
      'Split PDF files online: one file per page, every N pages, or custom page ranges. Free and private — your PDF is processed in your browser.',
    keywords: [
      'split pdf',
      'separate pdf pages',
      'pdf splitter',
      'divide pdf',
      'split pdf by pages',
    ],
    relatedTools: [
      'extract-pdf-pages',
      'merge-pdf',
      'reorder-pdf-pages',
      'rotate-pdf',
      'pdf-to-jpg',
    ],
    component: 'pdf-pages',
    config: { mode: 'split' },
    handlesFiles: true,
    popular: true,
    howTo: [
      'Choose a PDF file.',
      'Pick a split mode: every page, every N pages, or custom ranges (separate ranges with semicolons, e.g. “1-3; 4-6; 7-”).',
      'Click “Split PDF” and download each part.',
    ],
    about: [
      'Splitting creates new, independent PDF files from parts of the original. Use it to send only the relevant pages of a long document, or to break a large scan into smaller files for email.',
    ],
    faqs: [
      {
        q: 'What is the difference between Split and Extract?',
        a: 'Split produces several files. Extract pages produces one new PDF containing just the pages you selected.',
      },
    ],
  },
  {
    slug: 'compress-pdf',
    category: 'pdf-tools',
    name: 'Compress PDF',
    icon: '🗜️',
    shortDescription: 'Reduce PDF file size in your browser.',
    description:
      'Make a PDF smaller in two ways: a lossless clean-up that keeps text selectable, or strong compression that converts each page to an optimised image. Your file is processed locally.',
    title: 'Compress PDF – Reduce PDF File Size Online Without Upload',
    metaDescription:
      'Compress PDF files online in your browser. Lossless optimisation or strong image-based compression for scans. Free, private, no upload.',
    keywords: [
      'compress pdf',
      'reduce pdf size',
      'pdf compressor',
      'shrink pdf',
      'make pdf smaller',
    ],
    relatedTools: ['image-compressor', 'merge-pdf', 'split-pdf', 'pdf-to-jpg'],
    component: 'pdf-compress',
    handlesFiles: true,
    limitation:
      'Browsers cannot re-compress images inside a PDF while keeping its text layer. “Strong” mode therefore turns each page into a JPG image — ideal for scans, but text will no longer be selectable or searchable.',
    howTo: [
      'Choose a PDF file.',
      'Pick “Lossless” to keep everything intact, or “Strong” and a quality level for scanned documents.',
      'Click “Compress” and compare the sizes before downloading.',
    ],
    about: [
      'PDF size is usually dominated by embedded images. Lossless mode rewrites the file structure more compactly (object streams), which helps most for PDFs exported by some office tools. Strong mode re-renders every page at a chosen resolution and JPG quality, which can shrink scanned documents dramatically.',
    ],
    faqs: [
      {
        q: 'Why did lossless mode barely reduce the size?',
        a: 'The PDF is already well optimised, or most of its size comes from images. Try Strong mode for scanned documents.',
      },
      {
        q: 'Will Strong mode keep my text searchable?',
        a: 'No — pages become images. Keep the original if you need to search or copy the text.',
      },
    ],
  },
  {
    slug: 'rotate-pdf',
    category: 'pdf-tools',
    name: 'Rotate PDF',
    icon: '🔃',
    shortDescription: 'Rotate all or selected PDF pages.',
    description:
      'Rotate every page of a PDF, or only selected pages, by 90°, 180° or 270°, and download the fixed document. Rotation is lossless and done in your browser.',
    title: 'Rotate PDF – Rotate PDF Pages Online and Save',
    metaDescription:
      'Rotate PDF pages online by 90 or 180 degrees. Rotate all pages or only selected ones and save permanently — free, lossless and private.',
    keywords: [
      'rotate pdf',
      'rotate pdf pages',
      'turn pdf',
      'fix sideways pdf',
    ],
    relatedTools: [
      'reorder-pdf-pages',
      'split-pdf',
      'merge-pdf',
      'image-rotator',
    ],
    component: 'pdf-pages',
    config: { mode: 'rotate' },
    handlesFiles: true,
    howTo: [
      'Choose a PDF file.',
      'Enter the pages to rotate (or leave “all”) and choose the angle.',
      'Click “Rotate” and download the PDF.',
    ],
    about: [
      'PDF rotation changes each page’s rotation attribute, so text and images keep their full quality. The change is saved permanently in the downloaded file.',
    ],
    faqs: [
      {
        q: 'Does rotating reduce quality?',
        a: 'No. Pages are not re-rendered; only their orientation setting changes.',
      },
    ],
  },
  {
    slug: 'extract-pdf-pages',
    category: 'pdf-tools',
    name: 'Extract PDF Pages',
    icon: '📑',
    shortDescription: 'Save selected pages as a new PDF.',
    description:
      'Pick the pages you need — like 1-3, 7, 10- — and save them as a new PDF. The original file stays unchanged, and everything runs in your browser.',
    title: 'Extract PDF Pages – Save Selected Pages as a New PDF',
    metaDescription:
      'Extract pages from a PDF online. Select page numbers or ranges and download them as a new PDF. Free and private — no upload.',
    keywords: [
      'extract pdf pages',
      'save pdf pages',
      'select pdf pages',
      'pdf page extractor',
    ],
    relatedTools: ['split-pdf', 'merge-pdf', 'reorder-pdf-pages', 'pdf-to-jpg'],
    component: 'pdf-pages',
    config: { mode: 'extract' },
    handlesFiles: true,
    howTo: [
      'Choose a PDF file.',
      'Type the pages to keep, e.g. “1-3, 7, 10-” (“odd” and “even” work too).',
      'Click “Extract pages” and download the new PDF.',
    ],
    about: [
      'Page ranges accept single pages (5), ranges (2-4), open ranges (10- for “to the end”) and the keywords odd and even.',
    ],
    faqs: [
      {
        q: 'Can I change the order while extracting?',
        a: 'Yes. Pages are added in the order you type them, so “3, 1, 2” puts page 3 first. For drag-free reordering of all pages, use Reorder PDF Pages.',
      },
    ],
  },
  {
    slug: 'reorder-pdf-pages',
    category: 'pdf-tools',
    name: 'Reorder PDF Pages',
    icon: '🔀',
    shortDescription: 'Change the order of pages in a PDF.',
    description:
      'Rearrange the pages of a PDF with page thumbnails and move buttons, or type a new order. Remove pages you do not need and download the result — all in your browser.',
    title: 'Reorder PDF Pages – Rearrange & Delete PDF Pages Online',
    metaDescription:
      'Reorder PDF pages online with thumbnails. Move, delete and rearrange pages, then download the new PDF. Free, private, processed in your browser.',
    keywords: [
      'reorder pdf pages',
      'rearrange pdf',
      'move pdf pages',
      'delete pdf pages',
      'organize pdf',
    ],
    relatedTools: ['merge-pdf', 'extract-pdf-pages', 'rotate-pdf', 'split-pdf'],
    component: 'pdf-pages',
    config: { mode: 'reorder' },
    handlesFiles: true,
    howTo: [
      'Choose a PDF file.',
      'Move pages up or down, or remove them, using the buttons next to each thumbnail.',
      'Click “Save new order” and download the PDF.',
    ],
    about: [
      'Reordering builds a new PDF with the pages in your chosen sequence. Pages are copied as they are, so text, links and quality are preserved.',
    ],
    faqs: [
      {
        q: 'Can I undo a removed page?',
        a: 'Click “Reset” to restore the original order and all pages before you save.',
      },
    ],
  },
  {
    slug: 'pdf-to-jpg',
    category: 'pdf-tools',
    name: 'PDF to JPG',
    icon: '🖼️',
    shortDescription: 'Convert PDF pages to JPG images.',
    description:
      'Convert every page of a PDF — or just selected pages — into high-quality JPG images. Choose the resolution (DPI) and quality. Rendering happens in your browser.',
    title: 'PDF to JPG Converter – Convert PDF Pages to Images Online',
    metaDescription:
      'Convert PDF to JPG online. Choose pages, resolution and quality, then download the images. Your PDF is rendered in your browser — never uploaded.',
    keywords: [
      'pdf to jpg',
      'pdf to jpeg',
      'pdf to image',
      'convert pdf to jpg',
    ],
    relatedTools: [
      'pdf-to-png',
      'image-converter',
      'pdf-to-text',
      'split-pdf',
      'image-compressor',
    ],
    component: 'pdf-to-image',
    config: { format: 'jpg' },
    handlesFiles: true,
    howTo: [
      'Choose a PDF file.',
      'Pick the pages, resolution (150 DPI is good for screens, 300 DPI for print) and quality.',
      'Convert and download each page as a JPG.',
    ],
    about: [
      'Each page is drawn by the same PDF engine Firefox uses (pdf.js) and saved as a JPG. JPG gives small files for pages with photos; for crisp text, PNG is often better.',
    ],
    faqs: [
      {
        q: 'Which DPI should I use?',
        a: '96–150 DPI for viewing on screen and sharing, 300 DPI for printing or OCR.',
      },
    ],
  },
  {
    slug: 'pdf-to-png',
    category: 'pdf-tools',
    name: 'PDF to PNG',
    icon: '🖼️',
    shortDescription: 'Convert PDF pages to sharp PNG images.',
    description:
      'Turn PDF pages into lossless PNG images with sharp text and line art. Choose the pages and resolution; conversion happens locally in your browser.',
    title: 'PDF to PNG Converter – High-Quality PDF to Image Online',
    metaDescription:
      'Convert PDF to PNG online with crisp, lossless output. Select pages and DPI and download — processed in your browser, never uploaded.',
    keywords: [
      'pdf to png',
      'convert pdf to png',
      'pdf page to image',
      'pdf to transparent png',
    ],
    relatedTools: [
      'pdf-to-jpg',
      'image-converter',
      'pdf-to-text',
      'extract-pdf-pages',
    ],
    component: 'pdf-to-image',
    config: { format: 'png' },
    handlesFiles: true,
    howTo: [
      'Choose a PDF file.',
      'Select pages and resolution.',
      'Convert and download the PNG images.',
    ],
    about: [
      'PNG uses lossless compression, so text, diagrams and slides stay perfectly sharp — at the cost of larger files than JPG for photo-heavy pages.',
    ],
    faqs: [
      {
        q: 'Is PNG or JPG better for PDF pages?',
        a: 'PNG for text, charts and slides; JPG for photos and scanned pages where file size matters.',
      },
    ],
  },
  {
    slug: 'pdf-to-text',
    category: 'pdf-tools',
    name: 'PDF to Text',
    icon: '📃',
    shortDescription: 'Extract text from a PDF.',
    description:
      'Extract all text from a PDF, page by page, and copy it or download it as a .txt file. Text extraction runs in your browser, so documents stay private.',
    title: 'PDF to Text – Extract Text from PDF Online',
    metaDescription:
      'Extract text from PDF files online. Copy or download the text page by page. Private and free — your PDF never leaves your device.',
    keywords: [
      'pdf to text',
      'extract text from pdf',
      'pdf text extractor',
      'copy text from pdf',
    ],
    relatedTools: [
      'pdf-to-jpg',
      'word-counter',
      'pdf-metadata-viewer',
      'find-and-replace',
    ],
    component: 'pdf-to-text',
    handlesFiles: true,
    limitation:
      'Scanned PDFs contain pictures of text rather than text, so there is nothing to extract without OCR (optical character recognition), which this tool does not perform.',
    howTo: [
      'Choose a PDF file.',
      'Wait a moment while each page is read.',
      'Copy the text or download it as a .txt file.',
    ],
    about: [
      'The tool reads the text layer stored in the PDF. Line breaks follow the PDF’s layout, so text from multi-column documents may need light clean-up.',
    ],
    faqs: [
      {
        q: 'Why is the extracted text empty?',
        a: 'The PDF is probably a scan (an image). Only PDFs with a real text layer can be extracted.',
      },
    ],
  },
  {
    slug: 'pdf-metadata-viewer',
    category: 'pdf-tools',
    name: 'PDF Metadata Viewer',
    icon: 'ℹ️',
    shortDescription: 'View and edit PDF title, author and properties.',
    description:
      'See a PDF’s hidden properties — title, author, creator app, producer, dates, page count and page sizes — and edit the title, author, subject and keywords. Everything runs in your browser.',
    title: 'PDF Metadata Viewer & Editor – View PDF Properties Online',
    metaDescription:
      'View and edit PDF metadata online: title, author, subject, keywords, creator, dates and page sizes. Free, private, no upload.',
    keywords: [
      'pdf metadata',
      'pdf properties',
      'edit pdf title',
      'pdf author',
      'pdf info',
    ],
    relatedTools: [
      'image-exif-viewer',
      'pdf-to-text',
      'compress-pdf',
      'merge-pdf',
    ],
    component: 'pdf-metadata',
    handlesFiles: true,
    howTo: [
      'Choose a PDF file.',
      'Review its properties and page sizes.',
      'Optionally edit the title, author, subject or keywords and download the updated PDF.',
    ],
    about: [
      'PDF metadata can reveal who created a document and with which software. Search engines also use the title field. Checking and cleaning it before publishing is good practice.',
    ],
    faqs: [
      {
        q: 'Can I remove the author name?',
        a: 'Yes — clear the Author field and download the updated PDF.',
      },
    ],
  },
];
