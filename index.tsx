import DynamicPagination from "@/components/ui/custom/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { DeleteSingle } from "./delete";
import NotFoundTableData from "@/components/not-found/table";
import EditApiKey from "../_edit";
import RegenerateApiKey from "../_regenerate";
import {
  SelectAllItem,
  SelectedRow,
  SelectSingleItem
} from "@/hooks/use-select";

export default function ApiKeysTable({
  data,
  meta
}: {
  data: any[];
  meta: any;
}) {
  // const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // const data = []
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <SelectAllItem
              table="api-keys"
              items={data?.map((item) => item.id)}
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Abilities</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Last Used At</TableHead>
          <TableHead className="w-[150px] text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-gray-600">
        {data?.length > 0 ? (
          data?.map((item, index) => (
            <SelectedRow table="api-keys" id={item.id} key={index}>
              <TableCell>
                <SelectSingleItem table="api-keys" id={item.id} />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>N/A</TableCell>
              <TableCell>N/A</TableCell>
              <TableCell>N/A</TableCell>
              <TableCell>N/A</TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1.5">
                  <EditApiKey />
                  <RegenerateApiKey />
                  <DeleteSingle item={{ id: index, name: "Front-end" }} />
                </div>
              </TableCell>
            </SelectedRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="py-1.5">
              <NotFoundTableData />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={7} className="py-1.5">
            <DynamicPagination data={meta} />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
