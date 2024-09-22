import {
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { ProviderType } from "./types";
import { Domain, Role, StandardDomain } from "../../types";
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { useAxios } from "../../app-providers/AxiosProvider";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { useAuth } from "../../app-providers/AuthProvider";

type FlattenedDomain = {
  domain: Domain;
  role: Role;
};

type CreateProviderProps = {
  onSave: (payload: ProviderType) => void;
  onCancel: () => void;
};

const getOptionLabel = (
  option: FlattenedDomain
) => `${option.domain.domainName} 
| ${option.role.roleName} 
| ${option.role.experienceLevel} 
| ${option.role.technologiesCatalog}`;

const getOptionKey = (option: FlattenedDomain) =>
  `${option.domain.domainName}-${option.role.roleName}-${option.role.experienceLevel}-${option.role.technologiesCatalog}`;

const getFlattenedDomain = (
  domains: StandardDomain[],
  techCats: string[],
  experienceLevels: string[]
) => {
  if (!domains?.length || !techCats?.length || !experienceLevels?.length) {
    return [];
  }
  const flattenedDomains: FlattenedDomain[] = [];
  const catExps: {
    experienceLevel: string;
    technologiesCatalog: string;
  }[] = [];
  techCats.forEach((tc) => {
    experienceLevels.forEach((el) => {
      catExps.push({
        experienceLevel: el,
        technologiesCatalog: tc,
      });
    });
  });
  domains.forEach((domain) => {
    const roles = domain.standardRoles || [];
    roles.forEach((role) => {
      catExps.forEach((ce) => {
        flattenedDomains.push({
          domain: {
            domainId: domain.domainId,
            id: domain.id,
            domainName: domain.domainName,
          },
          role: {
            roleName: role.roleName,
            id: role.id,
            technologiesCatalog: ce.technologiesCatalog,
            experienceLevel: ce.experienceLevel,
          },
        });
      });
    });
  });
  return flattenedDomains;
};

const getGroupedDomains = (domains: FlattenedDomain[]) => {
  const groupedDomains: Domain[] = [];
  domains.forEach((d) => {
    const existingDomain = groupedDomains.find(
      (dom) => dom.domainId === d.domain.domainId
    );
    const { id, ...restDomain } = d.domain;
    const { id: roleId, ...restRole } = d.role;

    if (existingDomain) {
      existingDomain.roles = existingDomain.roles?.concat(restRole);
    } else {
      groupedDomains.push({
        ...restDomain,
        roles: [restRole],
      });
    }
  });
  return groupedDomains;
};

const dateFormat = "YYYY-DD-MM";

const CreateProvider: FunctionComponent<CreateProviderProps> = ({
  onSave,
  onCancel,
}) => {
  const {
    control,
    getValues,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      providerName: "",
      existsSince: dayjs(),
      validFrom: dayjs(),
      validUntil: dayjs(),
      address: "",
      isAccepted: "false",
      experienceLevel: "",
      technologyLevel: "",
      price: 0,
      domains: [] as FlattenedDomain[],
    },
  });

  const axios = useAxios();
  const [domains, setDomains] = useState<StandardDomain[]>([]);
  const [experienceLevels, setExperienceLevel] = useState<string[]>([]);
  const [techCats, setTechCats] = useState<string[]>([]);
  const { userData } = useAuth();

  const handleSave = () => {
    const formValue = getValues();
    const payload: ProviderType = {
      providerName: formValue.providerName,
      existsSince: formValue.existsSince.format(dateFormat),
      validFrom: formValue.validFrom.format(dateFormat),
      validUntil: formValue.validUntil.format(dateFormat),
      address: formValue.address,
      userName: userData.username,
      isAccepted: "false",
      userType: userData.userType,
      experienceLevel: formValue.experienceLevel,
      technologyLevel: formValue.technologyLevel,
      price: 0,
      domains: getGroupedDomains(formValue.domains),
    };
    onSave(payload);
  };


  useEffect(() => {
    axios.get("/domains").then(({ data }) => setDomains(data));
  }, [axios]);

  useEffect(() => {
    axios.get("/techCataloglevels").then(({ data }) => setTechCats(data));
  }, [axios]);

  useEffect(() => {
    axios.get("/experiencelevels").then(({ data }) => setExperienceLevel(data));
  }, [axios]);

  const domainOptions = useMemo(
    () => getFlattenedDomain(domains, techCats, experienceLevels),
    [domains, techCats, experienceLevels]
  );

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Controller
        name="providerName"
        control={control}
        rules={{ required: true }}
        render={({
          field: { onChange, value },
          fieldState: { error },
        }) => (
          <TextField
            helperText={error ? error.message : null}
            error={!!error}
            onChange={onChange}
            value={value}
            fullWidth
            label="Provider Name"
            variant="outlined"
          />
        )}
      />
      <Controller
        name="domains"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value, ref } }) => (
          <Autocomplete
            multiple
            id="domain-tags"
            autoHighlight
            options={domainOptions}
            ref={ref}
            onChange={(_, item) => onChange(item)}
            value={value}
            isOptionEqualToValue={(option, value) =>
              getOptionKey(option) === getOptionKey(value)
            }
            getOptionKey={getOptionKey}
            getOptionLabel={(option) => getOptionLabel(option)}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box
                  sx={(theme) => ({
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                    width: "100%",
                    gap: 1,
                    padding: 1,
                    borderBottom: `1px solid ${theme.palette.grey[300]}`,
                  })}
                >
                  <Typography component="div" textAlign="left">
                    Domain: <Chip label={option.domain.domainName} />
                  </Typography>
                  <Typography component="div">
                    Role: <Chip label={option.role.roleName} />
                  </Typography>
                  <Typography component="div">
                    Experience: <Chip label={option.role.experienceLevel} />
                  </Typography>
                  <Typography component="div">
                    Technology Catalogue:
                    <Chip label={option.role.technologiesCatalog} />
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Domain and Roles"
                placeholder="Domain and Roles"
              />
            )}
            sx={{ width: "100%", height: "100%" }}
          />
        )}
      />
      <Controller
        name="address"
        control={control}
        rules={{ required: true }}
        render={({
          field: { onChange, value },
          fieldState: { error }
        }) => (
          <TextField
            helperText={error ? error.message : null}
            error={!!error}
            onChange={onChange}
            value={value}
            fullWidth
            label="Address"
            variant="outlined"
          />
        )}
      />
      <Controller
        control={control}
        name="validFrom"
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <DatePicker
              label="Valid From"
              format={dateFormat}
              sx={{ width: "100%" }}
              value={field.value}
              inputRef={field.ref}
              onChange={(date) => {
                field.onChange(date);
              }}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="validUntil"
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <DatePicker
              label="Valid Until"
              format={dateFormat}
              sx={{ width: "100%" }}
              value={field.value}
              inputRef={field.ref}
              onChange={(date) => {
                field.onChange(date);
              }}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="existsSince"
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <DatePicker
              label="Exist Since"
              format={dateFormat}
              sx={{ width: "100%" }}
              value={field.value}
              inputRef={field.ref}
              onChange={(date) => {
                field.onChange(date);
              }}
            />
          );
        }}
      />
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          disabled={!isValid}
          size="large"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button variant="outlined" size="large" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default CreateProvider;
