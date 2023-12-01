import axios from "axios";

// the entire goal is to like query the DB for all notes and store them in localStorage

export const fetchNotes = async (token_temp) => {
    const notesResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/notes`,
        {
            headers: {
                Authorization: `Bearer ${token_temp}`,
            },
        }
    );

    const parsedData = notesResponse.data.map(note => {
        return {
            id: note.noteID,
            title: note.title,
            content: note.content,
            tags: note.tags
        };
    });


    localStorage.setItem("notes", JSON.stringify(parsedData));
};

