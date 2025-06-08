import css from './NoteList.module.css';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({notes}: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('🗑️ Нотатку видалено');
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(`❌ Помилка видалення: ${error.message}`);
      } else {
        toast.error('❌ Невідома помилка при видаленні');
      }
    },
  });
  
  const handleDelete = (id: number) => {
    mutation.mutate(id)
  };

  return (
    <ul className={css.list}>
	     {notes.map(({title, content, tag, id}) => (
          <li className={css.listItem} key={id}>
           <h2 className={css.title}>{title}</h2>
           <p className={css.content}>{content}</p>
           <div className={css.footer}>
             <span className={css.tag}>{tag}</span>
             <button 
               onClick={() => {handleDelete(id)}} 
               className={css.button}
               disabled={mutation.isPending}>
                Delete
              </button>
           </div>
         </li>
        ))}
    </ul>
  )
}

