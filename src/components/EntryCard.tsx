// EntryCard.tsx
import React, { useState } from "react";
import { DiaryEntry } from "@/utils/diary"; // Your DiaryEntry type/interface
import { MoodBadge } from "./MoodSelector";
import { formatEntryDate } from "@/utils/date";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface EntryCardProps {
  entry: DiaryEntry;
  onEdit?: (entry: DiaryEntry) => void;
  onDelete?: (entryId: string) => void;
  showActions?: boolean;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const contentPreview =
    entry.content.length > 200
      ? entry.content.substring(0, 200) + "..."
      : entry.content;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(entry.id);
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className="rounded-xl shadow-sm border p-6 transition-shadow duration-200 hover:shadow-md"
        style={{
          background: "var(--color-surface)",
          borderColor: "1px solid var(--color-background)",
          color: "var(--color-text)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MoodBadge mood={entry.mood} size="small" />
            <span
              className="text-sm"
              style={{ color: "var(--color-text)", opacity: 0.6 }}
            >
              {formatEntryDate(entry.createdAt)}
            </span>
          </div>

          {showActions && (
            <div className="flex items-center space-x-2">
              {onEdit && (
                <button
                  title="Edit Entry"
                  onClick={() => onEdit(entry)}
                  className="p-1.5 rounded-md transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-primary)]"
                  style={{ color: "var(--color-text)" }}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              )}

              {onDelete && (
                <button
                  title="Delete Entry"
                  onClick={() => setShowDeleteModal(true)}
                  className="p-1.5 rounded-md transition-colors hover:bg-red-50 hover:text-red-600"
                  style={{ color: "var(--color-text)" }}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="prose prose-sm max-w-none"
          style={{ color: "var(--color-text)" }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: showFullContent ? entry.content : contentPreview,
            }}
          />
        </div>

        {/* Show more/less */}
        {entry.content.length > 200 && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="mt-3 text-sm font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            {showFullContent ? "Show less" : "Show more"}
          </button>
        )}

        {/* Images */}
        {entry.images && entry.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {entry.images.slice(0, 4).map((image, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Entry image ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {entry.images && entry.images.length > 4 && idx === 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium">
                      +{entry.images.length - 4} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full text-xs"
                style={{
                  backgroundColor: "var(--color-background)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-surface)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Entry"
      >
        <div className="space-y-4" style={{ color: "var(--color-text)" }}>
          <p>
            Are you sure you want to delete this entry? This action cannot be
            undone.
          </p>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Entry
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
