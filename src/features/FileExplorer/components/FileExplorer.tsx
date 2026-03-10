import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/router/routes';
import { LocalstorageHelper } from '@/shared/helpers';
import { LOCALSTORAGE_KEYS } from '@/shared/constants';
import { TreeNodeSchema } from '../fileExplorer.schemas';
import { buildTreeFromFiles } from '../fileExplorer.utils';
import { useToast } from '@/hooks';
import { cn } from '@/shared/utils';
import { Button } from '@/components/ui';

const PLACEHOLDER = `{
  "name": "root",
  "type": "folder", 
  "children": [
    { 
      "name": "src",
      "type": "folder",
      "children": [
        { "name": "index.ts", "type": "file", "size": 1024 }
      ]
    },
    { "name": "package.json", "type": "file", "size": 300 }
  ]
}`;

export const FileExplorer = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState('');

  const toast = useToast();

  function handleSubmit() {
    let raw: unknown;
    try {
      raw = JSON.parse(inputValue);
    } catch {
      toast.error('Invalid JSON — could not parse the input.');
      return;
    }

    const { success, data, error } = TreeNodeSchema.safeParse(raw);
    if (!success) {
      const first = error.issues[0];
      toast.error(
        `Invalid structure: ${first?.message ?? 'unknown error'} (at ${first?.path.join('.') ?? 'root'})`
      );
      return;
    }

    LocalstorageHelper.set(LOCALSTORAGE_KEYS.TREE_DATA, data);
    navigate(ROUTES.TREE);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') {
        setInputValue(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  async function handleFolderUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    // Yield to the browser so the UI unblocks before heavy work starts
    await new Promise((r) => setTimeout(r, 0));

    const tree = buildTreeFromFiles(files);
    const result = TreeNodeSchema.safeParse(tree);
    if (!result.success) {
      toast.error('Could not parse folder structure.');
      return;
    }

    LocalstorageHelper.set(LOCALSTORAGE_KEYS.TREE_DATA, result.data);
    navigate(ROUTES.TREE);
    e.target.value = '';
  }

  // Formats JSON: strips unwanted chars, pretty-prints
  const formatJson = (raw: string) => {
    // Strip leading/trailing chars not part of JSON object
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1 || end < start) throw new Error('No valid JSON object found');
    const jsonStr = raw.slice(start, end + 1);
    const parsed = JSON.parse(jsonStr);
    return JSON.stringify(parsed, null, 2);
  };

  const handleFormatJson = () => {
    try {
      const formatted = formatJson(inputValue);
      setInputValue(formatted);
    } catch {
      toast.error('Invalid JSON — could not parse or format the input.');
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 pb-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="type-heading-xs text-content-primary font-semibold">FileTree Explorer</h1>
          <p className="type-body-s text-content-secondary">
            Paste a JSON file structure or upload folder to explore.
          </p>
        </div>
        <div className="relative flex flex-col gap-2">
          <label className="type-body-xs text-content-secondary font-semibold tracking-wide uppercase">
            JSON input
          </label>

          {inputValue.trim() && (
            <Button className="absolute top-8 right-2" onClick={handleFormatJson}>
              Format
            </Button>
          )}

          <textarea
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            placeholder={PLACEHOLDER}
            rows={14}
            className={cn(
              'bg-surface-panel type-body-s text-content-primary min-h-100 w-full rounded-md border px-3 py-2',
              'resize-y focus:ring-2 focus:outline-none',
              'border-border focus:ring-content-accent-muted/20'
            )}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button className="h-12 w-full" onClick={handleSubmit} disabled={!inputValue.trim()}>
            Explore tree
          </Button>
          <Button className="h-12 w-full" onClick={() => fileInputRef.current?.click()}>
            Upload .json
          </Button>
          <Button className="h-12 w-full" onClick={() => folderInputRef.current?.click()}>
            Upload folder
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileUpload}
          />
          <input
            ref={folderInputRef}
            type="file"
            className="hidden"
            onChange={handleFolderUpload}
            // webkitdirectory is not in React's typings but is widely supported
            {...({ webkitdirectory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        </div>
      </div>
    </div>
  );
};
