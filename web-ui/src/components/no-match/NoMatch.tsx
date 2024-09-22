import { Link } from "@mui/material";
import { FunctionComponent } from "react";

const NoMatch: FunctionComponent = () => {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link href="/">Go to the home page</Link>
      </p>
    </div>
  );
};

export default NoMatch;
