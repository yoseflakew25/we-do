import {
  useGetNotesByApplicantIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from '@/app/api/slices/org-api-slice';
import { RichTextField } from '@/components/forms/ValidatedInputs';
import { Button, Card, CardBody, CardFooter, IconButton, Typography } from '@material-tailwind/react';
import { Spinner } from '@material-tailwind/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface NoteProps {
  applicantId: string;
}

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  applicationId: string;
  userId: string;
  orgId: string;
  date_added: string;
};

const Notes: React.FC<NoteProps> = ({ applicantId }) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [editorContent, setEditorContent] = useState('');

  // Fetch notes
  const {
    data: notesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetNotesByApplicantIdQuery(applicantId);

  const notes = notesData?.data || [];

  // Mutation hooks
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleAddClick = () => {
    setCurrentNote(null);
    setEditorContent('');
    setIsAddingNote(true);
  };

  const handleEditClick = (note: Note) => {
    setCurrentNote(note);
    setEditorContent(note.content);
    setIsAddingNote(true);
  };

  const handleSaveNote = async () => {
    if (!editorContent.trim()) {
      toast.error('Note content cannot be empty', { theme: 'light' });
      return;
    }

    try {
      if (currentNote) {
        // Update existing note
        await updateNote({
          id: currentNote.id,
          Content: editorContent,
        }).unwrap();
        toast.success('Note updated successfully!', { theme: 'light' });
      } else {
        // Create new note
        await createNote({
          ApplicationId: applicantId,
          Content: editorContent,
        }).unwrap();
        toast.success('Note added successfully!', { theme: 'light' });
      }
      setIsAddingNote(false);
      refetch();
    } catch (error) {
      const action = currentNote ? 'update' : 'create';
      toast.error(`Failed to ${action} note. Please try again.`, {
        theme: 'light',
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
   
      try {
        await deleteNote(noteId).unwrap();
        toast.success('Note deleted successfully!', { theme: 'light' });
        if (currentNote?.id === noteId) {
          setIsAddingNote(false);
          setCurrentNote(null);
        }
        refetch();
      } catch (error) {
        toast.error('Failed to delete note. Please try again.', {
          theme: 'light',
        });
      }
    
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 p-4">
        Error loading notes: {error.toString()}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end items-center">

        <Button
          className="bg-primary text-white rounded-3xl px-8"
          onClick={handleAddClick}
          disabled={isCreating}
        >
          {isCreating ? <Spinner className="h-5 w-5" /> : 'Add a Note'}
        </Button>
      </div>

      {/* Add/Edit Note Form */}
      {isAddingNote && (
        <div className="mb-8">
          <CardBody>
            <RichTextField
              value={editorContent}
              setValue={handleEditorChange}
            />
          </CardBody>
          <CardFooter className="flex justify-end gap-3 pt-0">
            <Button
              variant="outlined"
              color="gray"
              onClick={() => setIsAddingNote(false)}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary text-white rounded-xl px-8 hover:bg-primary-dark transition-colors"
              onClick={handleSaveNote}
              disabled={isCreating || isUpdating || !editorContent.trim()}
            >
              {isCreating || isUpdating ? (
                <Spinner className="h-5 w-5" />
              ) : currentNote ? (
                'Update'
              ) : (
                'Save'
              )}
            </Button>
          </CardFooter>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-2 mt-8">
        {notes.length === 0 && !isAddingNote ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Typography variant="paragraph" className="text-gray-500">
              No notes available. Click the button above to add your first note!
            </Typography>
          </div>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardBody className="pb-2">
                <div className="flex justify-between items-center">
                   
                    <Typography variant="small" className="text-gray-500">
                      {format(new Date(note.updated_at), 'MMM d, yyyy h:mm a')}
                    </Typography>
                  <div className="flex space-x-2">
                    <IconButton
                      variant="text"
                      size="sm"
                      onClick={() => handleEditClick(note)}
                      className="text-gray-600 hover:text-primary"
                      aria-label="Edit note"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      variant="text"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-600 hover:text-red-500"
                      aria-label="Delete note"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
                <div
                  className="my-2 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              </CardBody>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;