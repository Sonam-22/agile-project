import {
  AppBar,
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Paper,
  Rating,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  FunctionComponent,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { ProviderType } from "./types";
import { Domain } from "../../types";
import { useAxios } from "../../app-providers/AxiosProvider";
import { TransitionProps } from "@mui/material/transitions";
import CreateProvider from "./CreateProvider";
import { MasterAgreementType } from "../master-agreements/types";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center" | "inherit" | "justify" | undefined;
  format?: (value: any, agreementsMap: Map<string, string>) => ReactNode;
}

const columns: readonly Column[] = [
  {
    id: "providerId",
    label: "ID",
    minWidth: 50,
    format: (value: number) => value.toFixed(2),
  },
  { id: "providerName", label: "Provider Name", minWidth: 170 },
  {
    id: "domains",
    label: "Domains",
    minWidth: 200,
    align: "left",
    format: (domains: Domain[]) => (
      <Box>
        {domains?.map((domain) => {
          return (
            <Box sx={{ marginBottom: 1 }} key={domain.id}>
              <Typography gutterBottom variant="h6" component="div">
                {domain.domainId}-{domain.domainName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                {domain.roles?.map((role) => (
                  <Chip
                    key={role.id}
                    label={`${role.roleName} | ${role.experienceLevel} | ${role.technologiesCatalog}`}
                  />
                ))}
              </Typography>
            </Box>
          );
        })}
      </Box>
    ),
  },
  {
    id: "address",
    label: "Address",
    minWidth: 170,
    align: "left",
  },
  {
    id: "providerRating",
    label: "Rating",
    minWidth: 170,
    align: "left",
    format: (rating: string) => (
      <Rating value={Number(rating)} readOnly/>
    ),
  },
  {
    id: "validFrom",
    label: "Valid From",
    minWidth: 170,
    align: "right",
  },
  {
    id: "validUntil",
    label: "Valid Until",
    minWidth: 170,
    align: "right",
  },
  {
    id: "existsSince",
    label: "Exists Since",
    minWidth: 170,
    align: "right",
  },
];

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Providers: FunctionComponent = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<ProviderType[]>([]);
  const [open, setOpen] = useState(false);
  const [masterAgreements, setMasterAgreement] = useState<
    MasterAgreementType[]
  >([]);

  const axios = useAxios();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const fetchAllProviders = useCallback(() => {
    axios.get("/providers").then(({ data }) => setRows(data));
  }, [axios]);

  const handleSave = (payload: ProviderType) => {
    axios.post("/addProvider", payload).then(() => {
      fetchAllProviders();
      handleClose();
    });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => fetchAllProviders(), [fetchAllProviders]);

  useEffect(() => {
    axios.get("/mastertype/all").then(({ data }) => setMasterAgreement(data));
  }, [axios]);

  const agreementsMap = masterAgreements.reduce((acc, item) => {
    acc.set(String(item.masterAgreementTypeId) || "", item.masterAgreementTypeName)
    return acc
  }, new Map<string, string>())

  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" component="div" mb={2}>
          Providers
        </Typography>
        <Button
          variant="contained"
          onClick={handleClickOpen}
          startIcon={<AddIcon />}
        >
          Create Providers
        </Button>
      </Box>

      <Paper sx={{ width: "100%", overflow: "hidden", padding: 1 }}>
        <TableContainer sx={{  maxHeight: "50vh" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.providerId}
                    >
                      {columns.map((column) => {
                        const value = (row as any)[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value, agreementsMap) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell align="center" colSpan={columns.length}>
                    No providers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "sticky", top: 0 }}>
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Create Provider
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            backgroundColor: "inherit",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: 8,
          }}
        >
          <Paper
            sx={{
              width: "50%",
              padding: 1,
            }}
          >
            <CreateProvider
              onCancel={handleClose}
              onSave={handleSave}
            ></CreateProvider>
          </Paper>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Providers;
