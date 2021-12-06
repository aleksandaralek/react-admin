import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Box } from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import {
    useGetList,
    useGetIdentity,
    ReferenceField,
    TextField,
    FunctionField,
} from 'react-admin';
import { formatDistance } from 'date-fns';

import { Contact as ContactType } from '../types';

const PREFIX = 'LatestNotes';

const classes = {
    note: `${PREFIX}-note`,
    noteText: `${PREFIX}-noteText`,
    noteTextText: `${PREFIX}-noteTextText`,
};

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.note}`]: {
        marginBottom: theme.spacing(2),
    },

    [`& .${classes.noteText}`]: {
        backgroundColor: '#edf3f0',
        padding: theme.spacing(1),
        borderRadius: 10,
    },

    [`& .${classes.noteTextText}`]: {
        display: '-webkit-box',
        '-webkit-line-clamp': 3,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
    },
}));

export const LatestNotes = () => {
    const { identity } = useGetIdentity();
    const {
        data: contactNotesData,
        isLoading: contactNotesLoading,
    } = useGetList(
        'contactNotes',
        {
            pagination: { page: 1, perPage: 5 },
            sort: { field: 'date', order: 'DESC' },
            filter: { sales_id: identity?.id },
        },
        { enabled: Number.isInteger(identity?.id) }
    );
    const { data: dealNotesData, isLoading: dealNotesLoading } = useGetList(
        'dealNotes',
        {
            pagination: { page: 1, perPage: 5 },
            sort: { field: 'date', order: 'DESC' },
            filter: { sales_id: identity?.id },
        },
        { enabled: Number.isInteger(identity?.id) }
    );
    if (contactNotesLoading || dealNotesLoading) {
        return null;
    }
    // TypeScript guards
    if (!contactNotesData || !dealNotesData) {
        return null;
    }

    const allNotes = ([] as any[])
        .concat(
            contactNotesData.map(note => ({
                ...note,
                type: 'contactNote',
            })),
            dealNotesData.map(note => ({ ...note, type: 'dealNote' }))
        )
        .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
        .slice(0, 5);

    return (
        <Root>
            <Box display="flex" alignItems="center" marginBottom="1em">
                <Box ml={2} mr={2} display="flex">
                    <NoteIcon color="disabled" fontSize="large" />
                </Box>
                <Typography variant="h5" color="textSecondary">
                    My Latest Notes
                </Typography>
            </Box>
            <Card>
                <CardContent>
                    {allNotes.map(note => (
                        <div
                            id={`${note.type}_${note.id}`}
                            key={`${note.type}_${note.id}`}
                            className={classes.note}
                        >
                            <Typography color="textSecondary" gutterBottom>
                                on{' '}
                                {note.type === 'dealNote' ? (
                                    <Deal note={note} />
                                ) : (
                                    <Contact note={note} />
                                )}
                                , added{' '}
                                {formatDistance(
                                    new Date(note.date),
                                    new Date(),
                                    {
                                        addSuffix: true,
                                    }
                                )}
                            </Typography>
                            <div className={classes.noteText}>
                                <Typography className={classes.noteTextText}>
                                    {note.text}
                                </Typography>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </Root>
    );
};

const Deal = ({ note }: any) => (
    <>
        Deal{' '}
        <ReferenceField
            record={note}
            source="deal_id"
            reference="deals"
            basePath="/deals"
            link="show"
        >
            <TextField source="name" variant="body1" />
        </ReferenceField>
    </>
);

const Contact = ({ note }: any) => (
    <>
        Contact{' '}
        <ReferenceField
            record={note}
            source="contact_id"
            reference="contacts"
            basePath="/contacts"
            link="show"
        >
            <FunctionField<ContactType>
                variant="body1"
                render={contact =>
                    contact ? `${contact.first_name} ${contact.last_name}` : ''
                }
            />
        </ReferenceField>
    </>
);
