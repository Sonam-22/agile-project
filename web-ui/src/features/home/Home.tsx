import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HandshakeIcon from "@mui/icons-material/Handshake";
import HandymanIcon from "@mui/icons-material/Handyman";
import GavelIcon from "@mui/icons-material/Gavel";
import { MasterAgreementType } from "../master-agreements/types";
import { ProviderType } from "../providers/types";
import { useAxios } from "../../app-providers/AxiosProvider";
import { Offer } from "../offers/types";

const Home: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleCardClick = (to: string) => {
    navigate(to);
  };

  const [mats, setMats] = useState<MasterAgreementType[]>([]);
  const [providers, setProviders] = useState<ProviderType[]>([]);
  const [offers, setOffers] = useState<Offer["provider"]>([]);
  const axios = useAxios();

  useEffect(() => {
    axios.get("/mastertype/all").then(({ data }) => setMats(data));
    axios.get("/providers").then(({ data }) => setProviders(data));
    axios.get("/getAlloffers").then(({ data } : {data: Offer[]}) => {
      const providers = data.reduce((acc, item) => {
        acc.push(...item.provider)
        return acc;
      }, [] as Offer["provider"])
      setOffers(providers);
    });
  }, [axios]);

  return (
    <Fragment>
      <Box
        gap={16}
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={16}
      >
        <Card sx={{ width: 345 }}>
          <CardActionArea onClick={() => handleCardClick("/masteragreements")}>
            <CardMedia
              component="div"
              sx={{
                height: 140,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 100,
              }}
            >
              <HandshakeIcon fontSize={"inherit"} />
            </CardMedia>
            <CardContent>
             
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                textAlign="center"
              >
                Master Agreements  <Chip label={mats?.length} color="info"/>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card sx={{ width: 345 }}>
          <CardActionArea onClick={() => handleCardClick("/providers")}>
            <CardMedia
              component="div"
              sx={{
                height: 140,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 100,
              }}
            >
              <HandymanIcon fontSize={"inherit"} />
            </CardMedia>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                textAlign="center"
              >
                Providers  <Chip label={providers?.length} color="info"/>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card sx={{ width: 345 }}>
          <CardActionArea onClick={() => handleCardClick("/offers")}>
            <CardMedia
              component="div"
              sx={{
                height: 140,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 100,
              }}
            >
              <GavelIcon fontSize={"inherit"} />
            </CardMedia>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                textAlign="center"
              >
                Offers <Chip label={offers?.length} color="info"/>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Fragment>
  );
};

export default Home;