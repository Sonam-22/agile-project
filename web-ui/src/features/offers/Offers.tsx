import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  Fragment,
  FunctionComponent,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Action, Offer, OfferPayload } from "./types";
import { useAxios } from "../../app-providers/AxiosProvider";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/CheckCircle";
import { LoadingButton } from "@mui/lab";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center" | "inherit" | "justify" | undefined;
  format?: (value: any) => ReactNode;
}

const columns: readonly Column[] = [
  { id: "toggle", label: "", minWidth: 30 },
  { id: "id", label: "ID", minWidth: 30 },
  { id: "roleName", label: "Role", minWidth: 170 },
  {
    id: "experienceLevel",
    label: "Experience Level",
    minWidth: 170,
    align: "left",
  },
  {
    id: "technologiesCatalog",
    label: "Catalog",
    minWidth: 170,
    align: "left",
  },
  {
    id: "domainName",
    label: "Domain",
    minWidth: 120,
    align: "left",
  },
  {
    id: "masterAgreementTypeName",
    label: "Master Agreement",
    minWidth: 120,
    align: "left",
  },
];

const Row = (props: {
  row: Offer;
  defaultOpen: boolean;
  onAction: (action: OfferPayload) => void;
}) => {
  const { row, defaultOpen, onAction } = props;
  const [open, setOpen] = useState(defaultOpen);

  const providersByCycle = useMemo(
    () =>
      row.provider.reduce((acc, item) => {
        if (acc.has(item.cycle)) {
          acc.get(item.cycle)?.push(item);
        } else {
          acc.set(item.cycle, [item]);
        }
        return acc;
      }, new Map<number, Offer["provider"]>()),
    [row]
  );
  const anyAccepted = useMemo(
    () => row.provider.find((p) => p.isAccepted),
    [row.provider]
  );

  const rowCols = useMemo(
    () =>
      columns
        .filter((c) => c.id !== "toggle")
        .map((column) => {
          const value = (row as any)[column.id];
          return (
            <TableCell key={column.id} align={column.align}>
              {column.format ? column.format(value) : value}
            </TableCell>
          );
        }),
    [columns]
  );

  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {rowCols}
      </TableRow>
      <TableRow>
        <TableCell
          sx={() => ({ paddingBottom: 0, paddingTop: 0 })}
          colSpan={columns.length}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={() => ({ paddingBottom: 2, paddingTop: 2 })}
          >
            <Typography variant="h6" gutterBottom component="div">
              Providers
            </Typography>
            {Array.from(providersByCycle.entries())
              .sort((a, b) => a[0] - b[0])
              .map(([c, providers]) => {
                return (
                  <Paper sx={{ margin: 1, padding: 1 }} elevation={2} key={c}>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                      component="div"
                      color="primary"
                    >
                      Cycle {c}
                    </Typography>
                    <Table aria-label="providers">
                      <TableHead
                        sx={(theme) => ({
                          backgroundColor: theme.palette.grey[200],
                        })}
                      >
                        <TableRow>
                          <TableCell>Id</TableCell>
                          <TableCell>Offer Id</TableCell>
                          <TableCell>Provider Name</TableCell>
                          <TableCell>Quote Price (EUR)</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {providers
                          .sort((a, b) => (+a.quotePrice) - (+b.quotePrice))
                          .map((r) => {
                            return (
                              <TableRow key={r.id}>
                                <TableCell component="th" scope="row">
                                  {r.id}
                                </TableCell>
                                <TableCell>{r.offerId}</TableCell>
                                <TableCell>{r.name}</TableCell>
                                <TableCell>{r.quotePrice}</TableCell>
                                <TableCell>
                                  <Box display="flex" gap={2}>
                                    {!anyAccepted ? (
                                      <Button
                                        color="success"
                                        startIcon={<CheckIcon />}
                                        variant="contained"
                                        onClick={() =>
                                          onAction({
                                            offer: row,
                                            provider: r,
                                            action: Action.ACCPET,
                                          })
                                        }
                                        size="small"
                                      >
                                        Accept
                                      </Button>
                                    ) : (
                                      <Chip
                                        label={
                                          r.isAccepted ? "Accepted" : "Closed"
                                        }
                                        color={
                                          r.isAccepted ? "success" : "info"
                                        }
                                      />
                                    )}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </Paper>
                );
              })}
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

const Offers: FunctionComponent = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Offer[]>([]);
  const [ratingDlOpen, setRatingDlOpen] = useState(false);
  const [payload, setPayload] = useState<OfferPayload | null>();
  const axios = useAxios();
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  const handleOfferAction = (payload: OfferPayload) => {
    setPayload(payload);
    setRatingDlOpen(true);
  };

  const addRating = (_: SyntheticEvent, newValue: number | null) => {
    setPayload((pl) => {
      return (
        pl && {
          ...pl,
          rating: newValue || 0,
        }
      );
    });
  };

  const acceptOffer = () => {
    payload &&
      axios
        .put("/saveofferdetails", payload.offer, {
          params: {
            masterid: payload.offer.masterAgreementTypeId,
            providername: payload.provider.name,
            rating: payload.rating,
            offerid: payload.provider.offerId,
          },
        })
        .then(() => {
          fetchAllOffers();
          closeRatingDl();
        });
  };

  const closeRatingDl = () => {
    setRatingDlOpen(false);
    setPayload(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const fetchAllOffers = useCallback(() => {
    axios.get("/getAlloffers").then(({ data }) => setRows(data));
  }, [axios]);

  const handleRefresh = () => {
    setLoadingRefresh(true);
    axios
      .get("/fetchoffersforui")
      .then(() => fetchAllOffers())
      .finally(() => setLoadingRefresh(false));
  };

  const handleRatinDialogClosed = () => {};

  useEffect(() => {
    fetchAllOffers();
  }, [fetchAllOffers]);

  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" component="div" mb={2}>
          Offers
        </Typography>
        <LoadingButton
          loading={loadingRefresh}
          variant="contained"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
        >
          Refresh
        </LoadingButton>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden", padding: 1 }}>
        <TableContainer sx={{ maxHeight: "60vh" }}>
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
                .map((row, index) => (
                  <Row
                    row={row}
                    key={row.id}
                    defaultOpen={index === 0}
                    onAction={handleOfferAction}
                  />
                ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell align="center" colSpan={columns.length}>
                    No offers available
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
      <Dialog onClose={handleRatinDialogClosed} open={ratingDlOpen}>
        <DialogTitle>
          Please rate the provider
          <Typography component="span" variant="h6" ml={1}>
            {payload?.provider?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" component="div" sx={{ mb: 2 }}>
            <Typography component="span" ml={1}>
              Please rate the provider based on
            </Typography>
            <List component="ol" sx={{ listStyle: "decimal", pl: 4 }} disablePadding>
              <ListItem sx={{ display: "list-item"}} disablePadding>Best price offered</ListItem>
              <ListItem sx={{ display: "list-item"}} disablePadding>Maximum roles provided</ListItem>
            </List>
          </Alert>
          <Box display="flex" justifyContent="center">
            <Rating
              value={payload?.rating || 0}
              size="large"
              onChange={addRating}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            startIcon={<CheckIcon />}
            variant="contained"
            disabled={!payload?.rating}
            onClick={acceptOffer}
          >
            Accept
          </Button>
          <Button variant="outlined" onClick={closeRatingDl}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Offers;
