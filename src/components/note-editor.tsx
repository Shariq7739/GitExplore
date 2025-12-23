
"use client";

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Code, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import type { Repository } from '@/lib/types';

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const toggleButtons = [
    { Icon: Bold, action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold') },
    { Icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic') },
    { Icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), isActive: editor.isActive('underline') },
    { Icon: List, action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList') },
    { Icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList') },
    { Icon: Code, action: () => editor.chain().focus().toggleCodeBlock().run(), isActive: editor.isActive('codeBlock') },
  ];

  return (
    <div className="border border-input rounded-t-md p-2 flex flex-wrap gap-1 bg-background">
      {toggleButtons.map(({ Icon, action, isActive }, index) => (
        <Button
          key={index}
          onClick={action}
          variant={isActive ? 'secondary' : 'ghost'}
          size="sm"
          type="button"
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};


interface NoteEditorDialogProps {
  repo: Repository | null;
  note: string;
  onSave: (content: string) => void;
  onDelete: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const NoteEditorDialog = ({ repo, note, onSave, onDelete, isOpen, onOpenChange }: NoteEditorDialogProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: note,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert min-h-[200px] max-w-full rounded-b-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      },
    },
  });
  
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isOpen) {
      editor?.commands.setContent(note);
    }
  }, [isOpen, note]);

  const handleSave = () => {
    if (editor) {
      onSave(editor.getHTML());
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    onDelete();
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] bg-background/80 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle>Note for <span className="text-primary">{repo?.full_name}</span></DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>
        <DialogFooter>
          <Button type="button" variant="destructive" onClick={handleDelete} className="mr-auto">
            <Trash2 className="mr-2 h-4 w-4" /> Delete Note
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleSave}>Save Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
