import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useCallback } from 'react'
import { marked } from 'marked'

// Detecta si el texto pegado tiene sintaxis markdown
function looksLikeMarkdown(text) {
  return /^#{1,6}\s|^\*\*|^\*[^*]|^-\s|^\d+\.\s|^>\s/.test(text)
}
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Undo, Redo, Minus,
} from 'lucide-react'

// ── Botón de la barra de herramientas ──────────────────────────
function ToolbarBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition-colors text-sm font-medium leading-none
        ${active
          ? 'bg-rose-soft text-rose-dark'
          : 'text-[#6B6B6B] hover:bg-cream-dark hover:text-[#2A2A2A]'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="w-px h-5 bg-cream-darker mx-1 shrink-0" />
}

// ── Componente principal ───────────────────────────────────────
export default function TiptapEditor({ value, onChange, token, placeholder = 'Escribe el contenido del artículo aquí...' }) {
  const fileInputRef = useRef(null)
  const uploadingRef = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'focus:outline-none' },
    },
  })

  // Interceptar pegado de markdown y convertirlo a HTML
  useEffect(() => {
    if (!editor) return
    const dom = editor.view.dom
    const handlePaste = (e) => {
      const text = e.clipboardData?.getData('text/plain') ?? ''
      if (!looksLikeMarkdown(text)) return
      e.preventDefault()
      e.stopPropagation()
      const html = marked.parse(text, { breaks: false })
      editor.chain().focus().insertContent(html, {
        parseOptions: { preserveWhitespace: false },
      }).run()
    }
    dom.addEventListener('paste', handlePaste)
    return () => dom.removeEventListener('paste', handlePaste)
  }, [editor])

  // Sincronizar valor externo cuando cambia el post seleccionado
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (current !== value) {
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  // ── Link ──
  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href
    const url = window.prompt('URL del enlace:', prev ?? 'https://')
    if (url === null) return
    if (url === '') { editor.chain().focus().unsetLink().run(); return }
    editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  // ── Image ──
  const handleImageFile = useCallback(async (file) => {
    if (!file || !token || uploadingRef.current) return
    uploadingRef.current = true
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filename: file.name, contentType: file.type, data: base64 }),
      })
      const { url, error } = await res.json()
      if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run()
      else console.error('Error subiendo imagen:', error)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      uploadingRef.current = false
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [editor, token])

  if (!editor) return null

  return (
    <div className="border border-cream-darker rounded-xl overflow-hidden bg-white">
      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-cream-darker bg-cream/60">
        {/* Deshacer / Rehacer */}
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Deshacer">
          <Undo size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rehacer">
          <Redo size={15} />
        </ToolbarBtn>

        <Divider />

        {/* Encabezados */}
        {[1, 2, 3].map(level => (
          <ToolbarBtn
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            active={editor.isActive('heading', { level })}
            title={`Encabezado ${level}`}
          >
            <span className="text-xs font-bold w-5 inline-block text-center">H{level}</span>
          </ToolbarBtn>
        ))}

        <Divider />

        {/* Formato de texto */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrita">
          <Bold size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Cursiva">
          <Italic size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Subrayado">
          <UnderlineIcon size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Tachado">
          <Strikethrough size={15} />
        </ToolbarBtn>

        <Divider />

        {/* Listas */}
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
          <List size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
          <ListOrdered size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Cita">
          <Quote size={15} />
        </ToolbarBtn>

        <Divider />

        {/* Alineación */}
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Izquierda">
          <AlignLeft size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centrado">
          <AlignCenter size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Derecha">
          <AlignRight size={15} />
        </ToolbarBtn>

        <Divider />

        {/* Enlace e imagen */}
        <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title="Insertar enlace">
          <LinkIcon size={15} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => fileInputRef.current?.click()} title="Insertar imagen">
          <ImageIcon size={15} />
        </ToolbarBtn>

        <Divider />

        {/* Separador horizontal */}
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Línea divisoria">
          <Minus size={15} />
        </ToolbarBtn>
      </div>

      {/* Input de imagen oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleImageFile(e.target.files?.[0])}
      />

      {/* Área de edición */}
      <EditorContent
        editor={editor}
        className="px-5 py-4 text-[#2A2A2A] text-sm leading-relaxed min-h-[280px]"
      />
    </div>
  )
}
