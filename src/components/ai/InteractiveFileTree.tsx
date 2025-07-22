
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { ChevronDown, ChevronRight, File, Folder, MoreVertical, Edit, Trash2, Plus } from 'lucide-react';

interface ProjectFile {
  path: string;
  type: 'file' | 'directory';
  content?: string;
  size?: string;
  icon: React.ReactNode;
}

interface InteractiveFileTreeProps {
  files: ProjectFile[];
  onFileClick: (file: ProjectFile) => void;
  onFileDelete?: (file: ProjectFile) => void;
  onFileRename?: (file: ProjectFile, newName: string) => void;
  onNewFile?: (parentPath: string) => void;
}

export const InteractiveFileTree: React.FC<InteractiveFileTreeProps> = ({
  files,
  onFileClick,
  onFileDelete,
  onFileRename,
  onNewFile
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src/']));

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const buildTree = (files: ProjectFile[]) => {
    const tree: Record<string, ProjectFile[]> = {};
    const rootFiles: ProjectFile[] = [];

    files.forEach(file => {
      const pathParts = file.path.split('/');
      if (pathParts.length === 1 || (pathParts.length === 2 && file.path.endsWith('/'))) {
        rootFiles.push(file);
      } else {
        const parentPath = pathParts.slice(0, -1).join('/') + '/';
        if (!tree[parentPath]) {
          tree[parentPath] = [];
        }
        tree[parentPath].push(file);
      }
    });

    return { tree, rootFiles };
  };

  const renderFile = (file: ProjectFile, level = 0) => {
    const isDirectory = file.type === 'directory';
    const isExpanded = expandedFolders.has(file.path);
    const indent = level * 20;

    return (
      <div key={file.path}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center justify-between py-1 px-2 hover:bg-muted/50 cursor-pointer group`}
              style={{ paddingLeft: `${indent + 8}px` }}
              onClick={() => {
                if (isDirectory) {
                  toggleFolder(file.path);
                } else {
                  onFileClick(file);
                }
              }}
            >
              <div className="flex items-center gap-2 flex-1">
                {isDirectory && (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )
                )}
                {!isDirectory && <div className="w-4" />}
                {file.icon}
                <span className="text-sm truncate">{file.path.split('/').pop()}</span>
              </div>
              <div className="flex items-center gap-1">
                {file.size && (
                  <Badge variant="outline" className="text-xs">
                    {file.size}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle more actions
                  }}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            {!isDirectory && (
              <ContextMenuItem onClick={() => onFileClick(file)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </ContextMenuItem>
            )}
            {isDirectory && onNewFile && (
              <ContextMenuItem onClick={() => onNewFile(file.path)}>
                <Plus className="h-4 w-4 mr-2" />
                New File
              </ContextMenuItem>
            )}
            {onFileDelete && (
              <ContextMenuItem 
                onClick={() => onFileDelete(file)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>

        {isDirectory && isExpanded && (
          <div>
            {renderChildren(file.path, level + 1)}
          </div>
        )}
      </div>
    );
  };

  const renderChildren = (parentPath: string, level: number) => {
    const children = files.filter(file => {
      const filePath = file.path;
      const parentDepth = parentPath.split('/').length - 1;
      const fileDepth = filePath.split('/').length - (filePath.endsWith('/') ? 1 : 0);
      
      return filePath.startsWith(parentPath) && 
             filePath !== parentPath && 
             fileDepth === parentDepth + 1;
    });

    return children.map(child => renderFile(child, level));
  };

  const { rootFiles } = buildTree(files);

  return (
    <div className="space-y-1">
      {rootFiles.map(file => renderFile(file))}
    </div>
  );
};
