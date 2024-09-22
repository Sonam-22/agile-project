import { AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Fragment,
  FunctionComponent,
  PropsWithChildren,
  useState,
} from "react";
import { Outlet, useNavigate, NavLink as RouterLink } from "react-router-dom";
import { useAuth } from "../../app-providers/AuthProvider";

const linkStyle = (theme: Theme) => ({
  color: theme.palette.common.white,
  display: "block",
});

const Layout: FunctionComponent<PropsWithChildren> = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { userData, logout } = useAuth();


  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = (to: string) => {
    navigate(to);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const isMenuOpen = Boolean(anchorEl);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      sx={{ mt: "45px" }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{userData?.username}</MenuItem>
      <MenuItem onClick={handleMenuClose}>
        {userData?.first_name} {userData?.last_name}
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>{userData?.email}</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <Fragment>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              onClick={() => handleCardClick("/")}
              component="div"
              sx={{
                fontWeight: "bold",
              }}
            >
              Provider Management Platform
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                ml: 4,
                justifyContent: "flex-start",
                gap: 4,
              }}
            >
              <Link component={RouterLink} to="/" sx={linkStyle}>
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/masteragreements"
                sx={linkStyle}
              >
                Agreements
              </Link>
              <Link component={RouterLink} to="/providers" sx={linkStyle}>
                Providers
              </Link>
              <Link component={RouterLink} to="/offers" sx={linkStyle}>
                Offers
              </Link>
            </Box>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle fontSize="large" />
            </IconButton>
          </Toolbar>
        </AppBar>
        {renderMenu}
      </Box>
      <Outlet />
    </Fragment>
  );
};

export default Layout;
