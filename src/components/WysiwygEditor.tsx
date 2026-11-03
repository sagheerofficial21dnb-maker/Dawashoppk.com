import React, { useState, useRef, useEffect } from 'react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  onShowToast,
}) => {
  const [mode, setMode] = useState<'visual' | 'code' | 'preview'>('visual');
  const [formatSelect, setFormatSelect] = useState('p');
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaAlt, setMediaAlt] = useState('');

  const visualEditorRef = useRef<HTMLDivElement>(null);
  const isInternalUpdating = useRef(false);

  // Sync value into Visual Editor when not actively typing inside it
  useEffect(() => {
    if (visualEditorRef.current && !isInternalUpdating.current) {
      if (visualEditorRef.current.innerHTML !== (value || '')) {
        visualEditorRef.current.innerHTML = value || '';
      }
    }
  }, [value, mode]);

  const handleVisualInput = () => {
    if (visualEditorRef.current) {
      isInternalUpdating.current = true;
      const html = visualEditorRef.current.innerHTML;
      onChange(html);
      setTimeout(() => {
        isInternalUpdating.current = false;
      }, 50);
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (mode !== 'visual') {
      setMode('visual');
      setTimeout(() => {
        if (visualEditorRef.current) {
          visualEditorRef.current.focus();
          document.execCommand(command, false, arg);
          handleVisualInput();
        }
      }, 50);
      return;
    }

    if (visualEditorRef.current) {
      visualEditorRef.current.focus();
      document.execCommand(command, false, arg);
      handleVisualInput();
    }
  };

  const handleFormatChange = (tag: string) => {
    setFormatSelect(tag);
    if (tag === 'p') {
      executeCommand('formatBlock', '<p>');
    } else if (tag === 'pre') {
      executeCommand('formatBlock', '<pre>');
    } else {
      executeCommand('formatBlock', `<${tag}>`);
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Enter destination URL (e.g. https://dawashoppk.com/#shop):', 'https://dawashoppk.com/');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleRemoveLink = () => {
    executeCommand('unlink');
  };

  // Media Insertion Handlers
  const handleLocalMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        insertMediaHtml(dataUrl, file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const insertMediaHtml = (url: string, altText: string) => {
    if (!url) return;
    let htmlSnippet = '';
    if (mediaType === 'image') {
      htmlSnippet = `<img src="${url}" alt="${altText || 'Product Image'}" class="rounded-xl my-3 max-w-full h-auto mx-auto border border-slate-200 shadow-xs" style="max-height: 420px; object-fit: contain;" />`;
    } else {
      htmlSnippet = `<video src="${url}" controls class="rounded-xl my-3 w-full border border-slate-200 shadow-xs" style="max-height: 400px;"></video>`;
    }

    if (mode === 'visual' && visualEditorRef.current) {
      visualEditorRef.current.focus();
      document.execCommand('insertHTML', false, htmlSnippet);
      handleVisualInput();
    } else {
      onChange((value || '') + '\n' + htmlSnippet + '\n');
    }

    setMediaModalOpen(false);
    setMediaUrl('');
    setMediaAlt('');
    if (onShowToast) onShowToast('Media inserted into content.', 'success');
  };

  return (
    <div className="border border-slate-300 rounded-2xl bg-white overflow-hidden shadow-xs">
      {/* Top Media & Mode Action Bar (WordPress Classic Style) */}
      <div className="bg-slate-100/90 px-3 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        {/* Add Media Button */}
        <button
          type="button"
          onClick={() => setMediaModalOpen(true)}
          className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#002B49] rounded-lg border border-slate-300 text-xs font-black flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <i className="fa-solid fa-photo-film text-amber-500"></i>
          <span>Add Media</span>
        </button>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center rounded-lg bg-slate-200/80 p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('visual')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              mode === 'visual' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-pen-nib mr-1"></i> Visual
          </button>
          <button
            type="button"
            onClick={() => setMode('code')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              mode === 'code' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-code mr-1"></i> HTML / Code
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-3 py-1 rounded-md transition cursor-pointer ${
              mode === 'preview' ? 'bg-white text-[#002B49] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-eye mr-1"></i> Preview
          </button>
        </div>
      </div>

      {/* WordPress Formatting Toolbar (When not in preview) */}
      {mode !== 'preview' && (
        <div className="bg-slate-50 p-2 border-b border-slate-200 flex flex-wrap items-center gap-1 text-slate-700">
          {/* Format Dropdown (H1 - H6, Paragraph, Pre) */}
          <select
            value={formatSelect}
            onChange={(e) => handleFormatChange(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer hover:border-slate-400 mr-1"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1 (H1)</option>
            <option value="h2">Heading 2 (H2)</option>
            <option value="h3">Heading 3 (H3)</option>
            <option value="h4">Heading 4 (H4)</option>
            <option value="h5">Heading 5 (H5)</option>
            <option value="h6">Heading 6 (H6)</option>
            <option value="pre">Preformatted</option>
          </select>

          <div className="w-px h-5 bg-slate-300 mx-0.5" />

          {/* Inline Styles */}
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
            title="Bold (Ctrl+B)"
          >
            <i className="fa-solid fa-bold"></i>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs"
            title="Italic (Ctrl+I)"
          >
            <i className="fa-solid fa-italic"></i>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs"
            title="Underline (Ctrl+U)"
          >
            <i className="fa-solid fa-underline"></i>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs"
            title="Strikethrough"
          >
            <i className="fa-solid fa-strikethrough"></i>
          </button>

          <div className="w-px h-5 bg-slate-300 mx-0.5" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs"
            title="Bulleted List"
          >
            <i className="fa-solid fa-list-ul"></i>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs"
            title="Numbered List"
          >
            <i className="fa-solid fa-list-ol"></i>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs"
            title="Blockquote"
          >
            <i className="fa-solid fa-quote-left"></i>
          </button>

          <div className="w-px h-5 bg-slate-300 mx-0.5" />

          {/* Text Alignment */}
          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs"
            title="Align Left"
          >
            <i className="fa-solid fa-align-left"></i>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs"
            title="Align Center"
          >
            <i className="fa-solid fa-align-center"></i>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyRight')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs"
            title="Align Right"
          >
            <i className="fa-solid fa-align-right"></i>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyFull')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs"
            title="Justify"
          >
            <i className="fa-solid fa-align-justify"></i>
          </button>

          <div className="w-px h-5 bg-slate-300 mx-0.5" />

          {/* Links */}
          <button
            type="button"
            onClick={handleInsertLink}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs text-blue-600"
            title="Insert/Edit Link"
          >
            <i className="fa-solid fa-link"></i>
          </button>
          <button
            type="button"
            onClick={handleRemoveLink}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs text-rose-600"
            title="Remove Link"
          >
            <i className="fa-solid fa-link-slash"></i>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            className="w-7 h-7 rounded hover:bg-slate-200 flex items-center justify-center text-xs text-slate-500"
            title="Clear Formatting"
          >
            <i className="fa-solid fa-eraser"></i>
          </button>
        </div>
      )}

      {/* Main Editing Surface */}
      <div className="min-h-[280px] p-4 text-slate-800 text-sm leading-relaxed">
        {mode === 'visual' && (
          <div
            ref={visualEditorRef}
            contentEditable
            onInput={handleVisualInput}
            className="outline-none min-h-[280px] prose prose-slate max-w-none focus:ring-0 [&>h1]:text-2xl [&>h1]:font-black [&>h1]:text-[#002B49] [&>h1]:my-3 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-[#002B49] [&>h2]:my-2 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-[#002B49] [&>h3]:my-2 [&>p]:my-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-amber-400 [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-slate-600"
            data-placeholder="Start typing or formatting your comprehensive product description..."
          />
        )}

        {mode === 'code' && (
          <textarea
            rows={14}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Edit raw HTML code here..."
            className="w-full font-mono text-xs sm:text-sm text-slate-800 outline-none leading-relaxed resize-y bg-slate-50/50 p-2 rounded-lg border border-slate-200"
          />
        )}

        {mode === 'preview' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 prose prose-slate max-w-none">
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: value }} />
            ) : (
              <p className="text-slate-400 italic">No description content entered yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Add Media Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#002B49] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <i className="fa-solid fa-photo-film text-amber-400"></i>
                <span>Insert Media Into Content</span>
              </h3>
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-200 pb-3">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="mediaType"
                    checked={mediaType === 'image'}
                    onChange={() => setMediaType('image')}
                    className="text-[#002B49]"
                  />
                  <span>Image</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="radio"
                    name="mediaType"
                    checked={mediaType === 'video'}
                    onChange={() => setMediaType('video')}
                    className="text-[#002B49]"
                  />
                  <span>Video</span>
                </label>
              </div>

              {/* Upload from local device */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload from Device:
                </label>
                <input
                  type="file"
                  accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleLocalMediaUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#002B49] file:text-white hover:file:bg-[#0d3b66] cursor-pointer"
                />
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-2 text-[10px] text-slate-400 uppercase font-bold">Or enter URL</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct Media URL:
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={mediaType === 'image' ? 'https://example.com/image.jpg' : 'https://example.com/video.mp4'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-[#002B49]"
                />
              </div>

              {mediaType === 'image' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alt Text (Description):
                  </label>
                  <input
                    type="text"
                    value={mediaAlt}
                    onChange={(e) => setMediaAlt(e.target.value)}
                    placeholder="e.g. Super Viga Bottle packaging"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none focus:border-[#002B49]"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMediaModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => insertMediaHtml(mediaUrl, mediaAlt)}
                  disabled={!mediaUrl.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  Insert Into Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
