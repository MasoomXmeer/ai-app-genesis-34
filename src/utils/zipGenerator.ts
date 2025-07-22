
interface ProjectFile {
  path: string;
  type: 'file' | 'directory';
  content?: string;
  size?: string;
  icon?: React.ReactNode;
}

export const generateZip = async (files: ProjectFile[], projectName: string): Promise<Blob> => {
  // Create a simple zip-like structure using JSZip-like approach
  const JSZip = await import('jszip').then(m => m.default).catch(() => null);
  
  if (!JSZip) {
    // Fallback: create a tar-like structure as text
    return createFallbackArchive(files, projectName);
  }

  const zip = new JSZip();
  
  // Add files to zip
  files.forEach(file => {
    if (file.type === 'file' && file.content) {
      zip.file(file.path, file.content);
    }
  });

  // Generate the zip blob
  return await zip.generateAsync({ type: 'blob' });
};

const createFallbackArchive = (files: ProjectFile[], projectName: string): Blob => {
  let archiveContent = `# ${projectName} - Generated Project\n\n`;
  
  files.forEach(file => {
    if (file.type === 'file') {
      archiveContent += `\n## File: ${file.path}\n`;
      archiveContent += '```\n';
      archiveContent += file.content || '';
      archiveContent += '\n```\n';
    }
  });

  return new Blob([archiveContent], { type: 'text/plain' });
};

export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
