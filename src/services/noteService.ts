import axios from 'axios';
import type { Note } from '../types/note';

interface NotesHttpResponse {
    notes: Note[];
    totalPages: number;
}

interface NewNote {
    title: string;
    content: string;
    tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

const URL = 'https://notehub-public.goit.study/api/notes';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const headers = {
    Authorization: `Bearer ${token}`,
};

export const fetchNotes = async (query: string, page: number): Promise<NotesHttpResponse> => {
    const parameters = new URLSearchParams({
        ...(query !== '' ? { search: query } : {}),
        page: page.toString(),
        perPage: '12',
    });

    const response = await axios.get<NotesHttpResponse>(`${URL}?${parameters}`, {
        headers
    });
    return response.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
    const response = await axios.post<Note>(URL, newNote, {
        headers
    });
    return response.data;
};

export const deleteNote = async (id: number | string): Promise<Note> => {
    const response = await axios.delete<Note>(`${URL}/${id}`, {
        headers
    });
    return response.data;
}; 


// https://jsonplaceholder.typicode.com/todos

// if (!token) {
//     throw new Error("VITE_NOTEHUB_TOKEN is not defined!");
// }
