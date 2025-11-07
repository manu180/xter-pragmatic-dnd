import type { Group } from "../types/data";

const data: Group[] = [
  {
    id: "priority-0",
    documents: [
      {
        id: "Doc1",
        name: "Document 1",
        files: [
          {
            id: "File1",
            filename: "file1.txt",
          },
          {
            id: "File2",
            filename: "file2.txt",
          },
        ],
      },
      {
        id: "Doc2",
        name: "Document 2",
        files: [
          {
            id: "File3",
            filename: "file3.txt",
          },
        ],
      },
    ],
  },
  {
    id: "priority-1",
    documents: [
      {
        id: "Doc3",
        name: "Document 3",
        files: [
          {
            id: "File4",
            filename: "file4.txt",
          },
          {
            id: "File5",
            filename: "file5.txt",
          },
          {
            id: "File6",
            filename: "file6.txt",
          },
        ],
      },
      {
        id: "Doc4",
        name: "Document 4",
        files: [
          {
            id: "File7",
            filename: "file7.txt",
          },
        ],
      },
    ],
  },
  {
    id: "priority-2",
    documents: [
      {
        id: "Doc5",
        name: "Document 5",
        files: [
          {
            id: "File8",
            filename: "file8.txt",
          },
          {
            id: "File9",
            filename: "file9.txt",
          },
          {
            id: "File10",
            filename: "file10.txt",
          },
          {
            id: "File11",
            filename: "file11.txt",
          },
        ],
      },
    ],
  },
  {
    id: "priority-3",
    documents: [
      {
        id: "Doc6",
        name: "Document 6",
        files: [
          {
            id: "File12",
            filename: "file12.txt",
          },
        ],
      },
    ],
  },
  {
    id: "priority-4",
    documents: [
      {
        id: "Doc7",
        name: "Document 7",
        files: [
          {
            id: "File13",
            filename: "file13.txt",
          },
        ],
      },
      {
        id: "Doc8",
        name: "Document 8",
        files: [
          {
            id: "File14",
            filename: "file14.txt",
          },
          {
            id: "File15",
            filename: "file15.txt",
          },
          {
            id: "File16",
            filename: "file16.txt",
          },
        ],
      },
    ],
  },
];

export function getData(): Group[] {
  return data;
}
