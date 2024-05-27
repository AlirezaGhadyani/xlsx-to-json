"use client";
import { useState, useEffect } from "react";
import { FileDropzone } from "@/components";
import { readXlsx, jsonViewer } from "@/utils";

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
              <div
                className="container mx-auto px-4 max-h-80 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: jsonViewer(xlsxJson) }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
