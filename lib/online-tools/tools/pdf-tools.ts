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
      'Click “Rotate pages” and download the PDF.',
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
      'Rearrange the pages of a PDF with page thumbnails and move buttons. Remove pages you do not need and download the result — all in your browser.',
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

  {
    slug: 'sign-pdf',
    category: 'pdf-tools',
    name: 'Sign PDF',
    icon: '✍️',
    shortDescription: 'Draw or type a signature and place it on a PDF.',
    description:
      'Sign a PDF by drawing your signature with a mouse or finger, or by typing your name in a handwriting font, then click where it should go. The signed PDF is created in your browser — the document is never uploaded.',
    title: 'Sign PDF Online – Draw or Type Your Signature, Free & Private',
    metaDescription:
      'Sign PDF documents online for free. Draw or type your signature, place it on any page, and download — the PDF is never uploaded to a server.',
    keywords: [
      'sign pdf',
      'sign pdf online',
      'add signature to pdf',
      'e-sign pdf free',
      'pdf signature',
    ],
    relatedTools: [
      'add-page-numbers-to-pdf',
      'watermark-pdf',
      'merge-pdf',
      'protect-pdf',
      'compress-pdf',
    ],
    component: 'pdf-sign',
    handlesFiles: true,
    popular: true,
    limitation:
      'This adds a visible signature image (an electronic signature). It does not add a certificate-based digital signature, which some legal processes require.',
    howTo: [
      'Choose the PDF you need to sign.',
      'Draw your signature, or type your name and pick a style.',
      'Pick the page, click on the preview where the signature should go, adjust its size, and download the signed PDF.',
    ],
    about: [
      'A drawn or typed signature placed on a PDF is a simple electronic signature. It is accepted for many everyday documents such as rental forms, permission slips and invoices.',
      'Contracts that require an advanced or qualified electronic signature (for example under the EU eIDAS regulation) need a certificate-based signing service instead.',
    ],
    faqs: [
      {
        q: 'Can I add the date next to my signature?',
        a: 'Yes — tick “Add today’s date” and today’s date is placed under the signature.',
      },
      {
        q: 'Can I sign several pages?',
        a: 'Place the signature, then switch pages and place it again before downloading; every placement is kept.',
      },
    ],
  },
  {
    slug: 'add-page-numbers-to-pdf',
    category: 'pdf-tools',
    name: 'Add Page Numbers to PDF',
    icon: '🔢',
    shortDescription: 'Number the pages of a PDF.',
    description:
      'Add page numbers to a PDF in the position and format you choose — “1”, “Page 1”, “1 of 10” or “Page 1 of 10” — and skip the cover page if you like. Numbering happens in your browser.',
    title: 'Add Page Numbers to PDF Online – Free, No Upload',
    metaDescription:
      'Add page numbers to any PDF online. Choose position, format (Page 1 of 10), font size and start number. Free and processed in your browser.',
    keywords: [
      'add page numbers to pdf',
      'number pdf pages',
      'pdf page numbering',
      'insert page numbers pdf',
    ],
    relatedTools: [
      'merge-pdf',
      'watermark-pdf',
      'sign-pdf',
      'reorder-pdf-pages',
      'split-pdf',
    ],
    component: 'pdf-page-numbers',
    handlesFiles: true,
    howTo: [
      'Choose a PDF.',
      'Pick the position, number format, font size and the number to start from.',
      'Click “Add page numbers” and download the PDF.',
    ],
    about: [
      'Page numbers are drawn onto each page as text in Helvetica, so they print and display everywhere. Rotated pages are handled so the numbers stay upright.',
      'Use “Skip first page” for documents with a cover; numbering then starts on page 2 with the start number you choose.',
    ],
    faqs: [
      {
        q: 'Can I number only some pages?',
        a: 'You can skip the first page. To number a section only, extract those pages, number them and merge the PDF back together.',
      },
    ],
  },
  {
    slug: 'watermark-pdf',
    category: 'pdf-tools',
    name: 'Watermark PDF',
    icon: '💧',
    shortDescription: 'Stamp text like CONFIDENTIAL or DRAFT on a PDF.',
    description:
      'Add a text watermark such as “CONFIDENTIAL”, “DRAFT” or your company name across every page of a PDF, with your choice of size, colour, opacity and angle. Processed locally in your browser.',
    title: 'Watermark PDF Online – Add CONFIDENTIAL or DRAFT Text Free',
    metaDescription:
      'Add a text watermark to every page of a PDF online. Set text, colour, opacity, size and rotation. Free and private — your PDF is never uploaded.',
    keywords: [
      'watermark pdf',
      'add watermark to pdf',
      'pdf watermark online',
      'confidential watermark pdf',
      'draft watermark',
    ],
    relatedTools: [
      'add-page-numbers-to-pdf',
      'protect-pdf',
      'sign-pdf',
      'compress-pdf',
      'merge-pdf',
    ],
    component: 'pdf-watermark',
    handlesFiles: true,
    howTo: [
      'Choose a PDF.',
      'Type the watermark text and adjust size, colour, opacity and angle (diagonal by default).',
      'Click “Add watermark” and download the PDF.',
    ],
    about: [
      'A watermark discourages copying and makes the status of a document obvious. It is drawn as semi-transparent text on top of each page.',
      'The watermark font covers Latin-script text, including accented letters such as é, ü and ñ. Cyrillic, Greek, Asian scripts and emoji are not supported.',
      'A watermark is not tamper-proof: anyone with a PDF editor can remove it. Combine it with password protection for sensitive documents.',
    ],
    faqs: [
      {
        q: 'Will the text under the watermark still be selectable?',
        a: 'Yes. The watermark is added on top; the original text layer is unchanged.',
      },
    ],
  },
  {
    slug: 'protect-pdf',
    category: 'pdf-tools',
    name: 'Protect PDF',
    icon: '🔒',
    shortDescription: 'Add a password to a PDF (AES-256).',
    description:
      'Password-protect a PDF with AES-256 encryption so it can only be opened with your password. Optionally block printing and copying. Encryption happens in your browser using qpdf — the file and the password never leave your device.',
    title: 'Protect PDF With Password – AES-256 Encryption Online, Free',
    metaDescription:
      'Add a password to a PDF online with AES-256 encryption. Optionally restrict printing and copying. Your PDF and password never leave your device.',
    keywords: [
      'protect pdf',
      'password protect pdf',
      'encrypt pdf',
      'lock pdf',
      'add password to pdf',
    ],
    relatedTools: [
      'unlock-pdf',
      'watermark-pdf',
      'sign-pdf',
      'compress-pdf',
      'password-generator',
    ],
    component: 'pdf-protect',
    config: { mode: 'protect' },
    handlesFiles: true,
    popular: true,
    howTo: [
      'Choose a PDF.',
      'Enter a password (twice) and choose whether to allow printing and copying.',
      'Click “Protect PDF” and download the encrypted file.',
    ],
    about: [
      'The PDF is encrypted with AES-256, the strongest standard encryption in the PDF specification, using qpdf compiled to WebAssembly. Without the password the content cannot be read.',
      'There is no way to recover a forgotten password — keep a copy of the unprotected original or store the password in a password manager.',
    ],
    faqs: [
      {
        q: 'How strong should the password be?',
        a: 'Use at least 12 characters or a 4–5 word passphrase. Short passwords can be guessed by offline cracking tools.',
      },
      {
        q: 'Are printing and copying restrictions secure?',
        a: 'They are honoured by mainstream PDF readers but are not encryption — some tools ignore them. Only the open password truly protects the content.',
      },
    ],
  },
  {
    slug: 'unlock-pdf',
    category: 'pdf-tools',
    name: 'Unlock PDF',
    icon: '🔓',
    shortDescription: 'Remove the password from a PDF you can open.',
    description:
      'Remove the password and restrictions from a PDF you have the password for, so you don’t have to type it every time. Decryption runs locally in your browser.',
    title: 'Unlock PDF – Remove PDF Password Online (With Your Password)',
    metaDescription:
      'Remove the password from a PDF you are allowed to open. Enter the password once and download an unlocked copy. Free and processed in your browser.',
    keywords: [
      'unlock pdf',
      'remove pdf password',
      'decrypt pdf',
      'pdf password remover',
    ],
    relatedTools: [
      'protect-pdf',
      'merge-pdf',
      'compress-pdf',
      'pdf-to-text',
      'split-pdf',
    ],
    component: 'pdf-protect',
    config: { mode: 'unlock' },
    handlesFiles: true,
    limitation:
      'You need the PDF’s password. This tool does not crack or guess passwords. Only unlock documents you own or are authorised to modify.',
    howTo: [
      'Choose the password-protected PDF.',
      'Enter its password.',
      'Click “Unlock PDF” and download the copy without a password.',
    ],
    about: [
      'Bank statements, payslips and tax documents are often password-protected. Once you have the password, an unlocked copy is easier to archive, merge or print.',
      'PDFs with only printing/copying restrictions (an owner password) can usually be unlocked without entering anything.',
    ],
    faqs: [
      {
        q: 'I forgot the password — can you unlock it?',
        a: 'No. The tool only removes a password you provide. Contact whoever sent the document for the password.',
      },
    ],
  },
  {
    slug: 'delete-pdf-pages',
    category: 'pdf-tools',
    name: 'Delete PDF Pages',
    icon: '🗑️',
    shortDescription: 'Remove unwanted pages from a PDF.',
    description:
      'Delete pages from a PDF in seconds: click the pages you don’t want — or type numbers like 2, 5-7 or “even” — and download a new PDF without them. The remaining pages keep their order and quality, and your file never leaves your device.',
    title: 'Delete PDF Pages – Remove Pages From a PDF Online, Free',
    metaDescription:
      'Remove pages from a PDF online. Click thumbnails or type page numbers to delete blank, duplicate or unwanted pages. Free, private — no upload.',
    keywords: [
      'delete pdf pages',
      'remove pages from pdf',
      'delete page from pdf',
      'pdf page remover',
      'remove blank pages pdf',
    ],
    relatedTools: [
      'extract-pdf-pages',
      'reorder-pdf-pages',
      'split-pdf',
      'merge-pdf',
      'crop-pdf',
    ],
    component: 'pdf-pages',
    config: { mode: 'delete' },
    handlesFiles: true,
    popular: true,
    howTo: [
      'Choose a PDF file.',
      'Click the page thumbnails you want to remove, or type pages like “2, 5-7” or “even”.',
      'Click “Delete pages” and download the new PDF.',
    ],
    about: [
      'Deleting creates a new PDF from the pages you keep, in their original order and at their original quality. Text, links, form fields and document details on the remaining pages are preserved (fields that were only on deleted pages are removed); the original file is not changed.',
      'Typed page lists and clicked thumbnails stay in sync, so you can mix both — for example type “even” and then click a few more pages. A PDF must keep at least one page.',
    ],
    faqs: [
      {
        q: 'Does deleting pages reduce quality?',
        a: 'No. The kept pages are copied as they are, without re-compressing images or converting text.',
      },
      {
        q: 'Can I delete pages from a password-protected PDF?',
        a: 'Remove the password first with Unlock PDF (you need to know it), then delete the pages.',
      },
    ],
  },
  {
    slug: 'crop-pdf',
    category: 'pdf-tools',
    name: 'Crop PDF',
    icon: '✂️',
    shortDescription: 'Trim margins and crop PDF pages.',
    description:
      'Crop PDF pages to remove white margins, scanner borders or unwanted areas. Drag the crop box on a page preview or enter margins in millimetres, trim white space automatically, and apply it to all pages, odd or even pages, or just one — right in your browser.',
    title: 'Crop PDF Online – Trim Margins & White Space, Free',
    metaDescription:
      'Crop PDF pages online: drag a crop box, trim white margins automatically or set exact margins in mm. Apply to all or selected pages. Free, no upload.',
    keywords: [
      'crop pdf',
      'trim pdf margins',
      'remove white margins pdf',
      'crop pdf pages',
      'pdf cropper',
    ],
    relatedTools: [
      'delete-pdf-pages',
      'rotate-pdf',
      'edit-pdf',
      'compress-pdf',
      'pdf-to-jpg',
    ],
    component: 'pdf-crop',
    handlesFiles: true,
    howTo: [
      'Choose a PDF file and go to the page you want to use as a guide.',
      'Drag the crop box (or its handles), type margins in millimetres, or click “Trim white margins”.',
      'Choose which pages to crop — all, this page, odd, even or a custom list.',
      'Click “Crop PDF” and download the result.',
    ],
    about: [
      'Cropping sets the PDF’s crop box, which tells viewers and printers which part of each page to show. “Trim white margins” measures the page you are viewing. It is lossless and instant: text stays selectable and nothing is re-compressed.',
      'Because the trimmed area is only hidden, the content outside the crop box is still inside the file. Don’t use cropping to remove confidential information — if it must be gone for good, convert it to images with PDF to JPG and turn those back into a PDF with the Image Converter. Margins set on one page are applied proportionally to pages of other sizes, and cropping an already-cropped PDF trims it further.',
    ],
    faqs: [
      {
        q: 'Can I crop just one page?',
        a: 'Yes. Set the crop box on that page and choose “This page only”, or list several pages under “Custom pages”.',
      },
      {
        q: 'Does cropping make the file smaller?',
        a: 'Usually not, because the hidden content stays in the file. To reduce the size, use Compress PDF afterwards.',
      },
    ],
  },
  {
    slug: 'edit-pdf',
    category: 'pdf-tools',
    name: 'Edit PDF',
    icon: '📝',
    shortDescription: 'Add text, images, white-out and highlights to a PDF.',
    description:
      'Edit a PDF online for free: click anywhere to add text, place images or a logo, cover mistakes with white-out boxes, and highlight important lines. Move and resize everything on the page preview, then download the edited PDF — processed entirely in your browser.',
    title: 'Edit PDF Online – Add Text, Images & White-Out, Free',
    metaDescription:
      'Edit PDF files online: add text, images, white-out boxes and highlights, move and resize them, and download. Free, no sign-up — your PDF is never uploaded.',
    keywords: [
      'edit pdf',
      'pdf editor',
      'add text to pdf',
      'write on pdf',
      'white out pdf',
      'add image to pdf',
    ],
    relatedTools: [
      'fill-pdf-form',
      'sign-pdf',
      'watermark-pdf',
      'add-page-numbers-to-pdf',
      'crop-pdf',
    ],
    component: 'pdf-edit',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Choose a PDF file.',
      'Pick “Add text” and click on the page, or draw a white-out, highlight or box; use “Add image” for pictures and logos.',
      'Select an item to change its text, font, size or colour; drag to move it and use the corner handle to resize boxes and images.',
      'Click “Save PDF” and download the edited file.',
    ],
    about: [
      'Your edits are added as a new layer on top of each page, in the order you add them — just as the preview shows — so the original text, images and layout stay exactly as they were. Text uses the standard PDF fonts Helvetica, Times and Courier, which support English and other Latin-alphabet languages.',
      'To change existing wording, cover it with a white-out box and type the new text on top. The covered text is hidden but still inside the file; if it must be removed completely, convert it to images with PDF to JPG and turn those back into a PDF with the Image Converter.',
    ],
    faqs: [
      {
        q: 'Can I edit the existing text in a PDF?',
        a: 'Not directly — PDFs store text as positioned glyphs, not editable paragraphs. Cover the old text with white-out and add new text in its place; for most forms and letters the result looks the same.',
      },
      {
        q: 'Which languages can I type?',
        a: 'English and other languages written with Latin letters, including accents like é, ü and ñ. Cyrillic, Greek, Arabic, Asian scripts and emoji aren’t supported by the built-in PDF fonts.',
      },
    ],
  },
  {
    slug: 'fill-pdf-form',
    category: 'pdf-tools',
    name: 'Fill PDF Form',
    icon: '🧾',
    shortDescription: 'Fill in fillable PDF forms without Acrobat.',
    description:
      'Fill out PDF forms online without Adobe Acrobat. The tool finds every fillable field — text boxes, checkboxes, radio buttons and drop-down lists — and shows them as a simple form; type your answers, optionally flatten the result, and download the completed PDF. Nothing is uploaded.',
    title: 'Fill PDF Form Online – Fillable Fields, No Acrobat, Free',
    metaDescription:
      'Fill out fillable PDF forms online: text fields, checkboxes, radio buttons and drop-downs. Optionally flatten, then download. Free, private, no upload.',
    keywords: [
      'fill pdf form',
      'fill out pdf',
      'pdf form filler',
      'fillable pdf',
      'flatten pdf form',
    ],
    relatedTools: [
      'edit-pdf',
      'sign-pdf',
      'merge-pdf',
      'protect-pdf',
      'compress-pdf',
    ],
    component: 'pdf-form',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Choose a PDF form.',
      'Fill in the fields listed next to the page preview — required fields are marked with *.',
      'Tick “Flatten the form” if the answers should no longer be editable.',
      'Click “Save filled PDF” and download it.',
    ],
    about: [
      'Fillable PDFs contain interactive form fields (AcroForms). The tool reads them in your browser, lists them with readable names (based on the field names the form’s author chose) and writes your answers back into the same fields, so the form still works in Acrobat, Preview and other readers.',
      'Flattening turns the answers into ordinary page content, which is useful before sending a form by email or printing it. Signature and button fields are skipped. Forms built only with Adobe XFA, and scanned forms without fields, can’t be filled this way — use Edit PDF to type onto them instead.',
    ],
    faqs: [
      {
        q: 'Why can’t I see any fields?',
        a: 'The PDF probably has no fillable fields — for example a scanned form or a flattened file. Open it in Edit PDF and add your text on top of the page.',
      },
      {
        q: 'Should I flatten the form?',
        a: 'Flatten when you’re finished and want to prevent changes, or when a recipient’s viewer doesn’t show form values. Keep it unflattened if you or someone else needs to edit it later.',
      },
    ],
  },
  {
    slug: 'grayscale-pdf',
    category: 'pdf-tools',
    name: 'Grayscale PDF',
    icon: '🌓',
    shortDescription:
      'Convert a PDF to grayscale, black & white or a scanned look.',
    description:
      'Convert a colour PDF to grayscale while keeping text selectable — ideal for printing, saving ink or meeting “black and white only” submission rules. You can also turn it into pure black & white, or make it look scanned with a slight tilt, grain and paper tone. Everything runs in your browser.',
    title: 'Grayscale PDF – Convert PDF to Black & White or Scanned Look',
    metaDescription:
      'Convert PDF to grayscale or black and white online, keeping text selectable, or make a PDF look scanned. Free, private, processed in your browser.',
    keywords: [
      'grayscale pdf',
      'pdf to black and white',
      'convert pdf to grayscale',
      'make pdf look scanned',
      'black and white pdf',
    ],
    relatedTools: [
      'compress-pdf',
      'pdf-to-jpg',
      'watermark-pdf',
      'crop-pdf',
      'merge-pdf',
    ],
    component: 'pdf-grayscale',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Choose a PDF file.',
      'Pick Grayscale (keeps text), Black & white, or Scanned look.',
      'For black & white and scanned look, choose the resolution and effect options.',
      'Click convert and download the new PDF.',
    ],
    about: [
      'Grayscale mode rewrites the colours inside the PDF — text, shapes and images — to shades of gray, so text stays sharp, selectable and searchable and the file stays small. If a page uses something that can’t be converted exactly — such as a colour gradient, a pattern, a spot colour or a CMYK photo — only that page is flattened into a 200 DPI gray image (links on it stop working) and the result tells you which pages.',
      'Black & white and scanned look render every page as an image: pure black-and-white suits faxes, copies and strict upload portals, while the scanned look adds a slight tilt, grain and paper tone for documents that should look printed and scanned. In both modes text is no longer selectable.',
    ],
    faqs: [
      {
        q: 'Will the text stay selectable?',
        a: 'In Grayscale mode, yes — text and vectors are kept. Black & white and Scanned look turn pages into images, so text can no longer be selected or searched.',
      },
      {
        q: 'Why would I make a PDF look scanned?',
        a: 'Some offices and portals expect documents that were printed, signed and scanned. Only use it for documents you’re entitled to submit — the effect changes how a file looks, not what it says.',
      },
    ],
  },
  {
    slug: 'word-to-pdf',
    category: 'pdf-tools',
    name: 'Word to PDF',
    icon: '📃',
    shortDescription: 'Convert Word (DOCX) documents to PDF.',
    description:
      'Convert Word documents (.docx) to PDF without uploading them. Headings, paragraphs, bold and italic text, lists, tables and images are turned into a PDF with selectable text, on A4 or US Letter pages — or use your browser’s print engine for the closest match to the original layout.',
    title: 'Word to PDF Converter – DOCX to PDF Online, No Upload',
    metaDescription:
      'Convert Word DOCX to PDF in your browser: text, headings, lists, tables and images, A4 or Letter. Free, private — your document is never uploaded.',
    keywords: [
      'word to pdf',
      'docx to pdf',
      'convert word to pdf',
      'word document to pdf',
      'doc to pdf',
    ],
    relatedTools: [
      'merge-pdf',
      'compress-pdf',
      'protect-pdf',
      'add-page-numbers-to-pdf',
      'pdf-to-text',
    ],
    component: 'word-to-pdf',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Choose a .docx file (save older .doc files as .docx first).',
      'Pick the page size and margins and check the content preview.',
      'Click “Convert to PDF” — or “Print / Save as PDF” to use your browser’s print engine.',
      'Download the PDF.',
    ],
    about: [
      'The document is read in your browser: text, headings, bold and italic, lists, tables, links and images are converted into a PDF with selectable text in the Roboto font, which covers Latin, Greek and Cyrillic.',
      'Word layouts can be complex. The converter keeps the structure but uses one consistent style: Word fonts, sizes, colours and alignment, manual page breaks, multiple columns, headers and footers are not reproduced, text-box contents flow into the body, footnotes move to the end, comments are skipped and tracked changes appear as accepted. Images in PNG or JPEG are kept, other formats are converted where the browser can read them, and EMF/WMF drawings are left out. “Print / Save as PDF” prints the same content through your browser, with your system fonts and every language supported.',
    ],
    faqs: [
      {
        q: 'Can I convert .doc files?',
        a: 'Not directly. Open the .doc in Word, LibreOffice or Google Docs, save it as .docx, then convert it here.',
      },
      {
        q: 'Will the PDF look exactly like my Word document?',
        a: 'Simple documents come out very close. Complex layouts are simplified; for the best match, use “Print / Save as PDF” or export to PDF from Word itself.',
      },
    ],
  },
];
