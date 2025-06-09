import css from './NoteList.module.css';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({notes}: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('🗑️ Note deleted');
      setDeletingId(null);
    },
    onError: (error) => {
      setDeletingId(null);
      if (error instanceof Error) {
        toast.error(`❌ Deletion error: ${error.message}`);
      } else {
        toast.error('❌ Unknown error while deleting');
      }
    },
  });
  
  const handleDelete = (id: number) => {
    setDeletingId(id);
    mutation.mutate(id);
  };

  if (notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>
  }

  return (
    <ul className={css.list}>
	     {notes.map(({id, title, content, tag }) => (
          <li className={css.listItem} key={id}>
           <h2 className={css.title}>{title}</h2>
           <p className={css.content}>{content}</p>
           <div className={css.footer}>
             <span className={css.tag}>{tag}</span>
             <button 
               onClick={() => {handleDelete(id)}} 
               className={css.button}
               disabled={mutation.isPending && deletingId === id}>
                {mutation.isPending && deletingId === id ? 'Deleting...' : 'Delete'}
              </button>
           </div>
         </li>
        ))}
    </ul>
  )
}

