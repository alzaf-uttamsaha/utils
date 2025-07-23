 <InvoiceDownloader id={sale?.id} />

"use client";
import React, { useState } from "react";
import MyDocument from "./my-doc";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import TableActionButton from "@/components/layout/table/table-action";
import { getSingleSale } from "@/lib/actions/sales";
import { LoaderCircle } from "lucide-react";
export default function InvoiceDownloader({ id }) {
  const [loading, setLoading] = useState(false);
  const handleDownload = async () => {
    try {
      setLoading(true);
      const data = await getSingleSale(id);
      console.log('datax', data?.data)
      if (data?.success) {
        const blob = await pdf(<MyDocument data={data?.data} />).toBlob();
        if (blob) {
          saveAs(blob, `invoice_${id}.pdf`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="size-6 rounded flex items-center justify-center bg-[#6366f1]">
          <LoaderCircle className="size-4 animate-spin text-white" />
        </div>
      ) : (
        <TableActionButton onClick={handleDownload} variant="pdf" />
      )}
    </div>
  );
}
