import css from './App.module.css';
import NoteList from '../NoteList/NoteList';
import NoteModal from '../NoteModal/NoteModal';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Loader from '../Loader/Loader';

import { fetchNotes } from '../../services/noteService';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';


export default function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isCreateNote, setIsCreateNote] =useState<boolean>(false);

  const updateQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setPage(1);
  };
    
  const [debouncedQuery] = useDebounce(query, 500);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['notes', debouncedQuery, page],
    queryFn: () => fetchNotes(debouncedQuery, page),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isLoading && data && data.notes.length === 0) {
      toast('📭 Нотаток не знайдено за цим запитом');
    }
  }, [isLoading, data]);

  const handleClick = () => setIsCreateNote(true);
  const handleClose = () => setIsCreateNote(false);

  return (
    <div className={css.app}>
      
      <header className={css.toolbar}>
        <SearchBox query={query} updateQuery={updateQuery} />
        
          {data?.totalPages && 
          data.totalPages > 1 && 
          <Pagination 
          page={page} 
          totalPages={data?.totalPages}
          onPageChange={setPage}
          />}
        
        <button onClick={handleClick} className={css.button}>Create note +</button>
      </header>
      
        {isSuccess && 
        data.notes.length > 0 && 
        <NoteList notes={data.notes} />}
      
        {isCreateNote &&
        <NoteModal onClose={handleClose} />}
      
        {isLoading &&
        <Loader />}
      
    </div>
  )
}

