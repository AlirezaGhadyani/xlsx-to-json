"use client";
import { useState, useEffect } from "react";
import { FileDropzone } from "@/components";
import { readXlsx, jsonViewer, copyToClipboard } from "@/utils";

export default function Home() {
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [xlsxJson, setXlsxJson] = useState<any[] | null>(null);
  const [xlsxJsonLoading, setXlsxJsonLoading] = useState(false);

  useEffect(() => {
    if (!xlsxFile) return setXlsxJson(null);

    (async () => {
      try {
        setXlsxJsonLoading(true);
        const xlsxJson = await readXlsx(xlsxFile);
        setXlsxJson(xlsxJson);
        setXlsxJsonLoading(false);
      } catch (error) {
        setXlsxJsonLoading(false);
      }
    })();
  }, [xlsxFile]);

  return (
    <main className="h-screen">
      <div className="h-full overflow-x-hidden overflow-y-auto text-center after:content-[''] after:w-0 after:h-full after:inline-block after:align-middle">
        <div className="relative inline-block w-full text-left align-middle md:max-w-sm lg:max-w-xl">
          <div className="flex flex-col justify-center items-center gap-6">
            <FileDropzone
              name="excel-file-input"
              title="XLSX File"
              description="Upload or darg & drop your file."
              file={xlsxFile}
              loading={xlsxJsonLoading}
              onDelete={() => setXlsxFile(null)}
              onChange={(e) => {
                const files = e.target.files;
                if (!files) return;
                return setXlsxFile(files[0]);
              }}
            />
            {xlsxJson && (
              <>
                <div
                  className="container mx-auto px-4 max-h-80 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: jsonViewer(xlsxJson) }}
                />
                <button
                  className="btn self-end"
                  onClick={() => copyToClipboard(JSON.stringify(xlsxJson))}
                >
                  Copy
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width={25}
                    height={25}
                  >
                    <path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
