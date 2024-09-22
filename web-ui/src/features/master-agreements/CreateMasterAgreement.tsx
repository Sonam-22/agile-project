import {
  Autocomplete,
  Box,
  Button,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAxios } from "../../app-providers/AxiosProvider";
import { Domain, Role, StandardDomain } from "../../types";
import { MasterAgreementType } from "./types";
import dayjs from "dayjs";
import { useAuth } from "../../app-providers/AuthProvider";

type FlattenedDomain = {
  domain: Domain;
  role: Role;
};

const getOptionLabel = (
  option: FlattenedDomain
) => `${option.domain.domainName} 
| ${option.role.roleName} 
| ${option.role.experienceLevel} 
| ${option.role.technologiesCatalog}`;

const getOptionKey = (option: FlattenedDomain) =>
`${option.domain.domainName}-${option.role.roleName}-${option.role.experienceLevel}-${option.role.technologiesCatalog}`;

type CreateMasterAgreementProps = {
  onSave: (payload: MasterAgreementType) => void;
  onCancel: () => void;
};

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

const CreateMasterAgreement: FunctionComponent<CreateMasterAgreementProps> = ({
  onSave,
  onCancel,
}) => {
  const {
    control,
    getValues,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      masterAgreementTypeName: "",
      validFrom: dayjs(),
      validUntil: dayjs(),
      dailyrateIndicator: "",
      deadline: dayjs(),
      teamdeadline: dayjs(),
      workscontractdeadline: dayjs(),
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
    const payload: MasterAgreementType = {
      masterAgreementTypeName: formValue.masterAgreementTypeName,
      validFrom: formValue.validFrom.format(dateFormat),
      validUntil: formValue.validUntil.format(dateFormat),
      dailyrateIndicator: formValue.dailyrateIndicator,
      deadline: formValue.deadline.format(dateFormat),
      teamdeadline: formValue.teamdeadline.format(dateFormat),
      workscontractdeadline: formValue.workscontractdeadline.format(dateFormat),
      userName: userData.username,
      userType: userData.userType,
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

  const domainOptions = useMemo(() => getFlattenedDomain(domains, techCats, experienceLevels), [domains, techCats, experienceLevels]);

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
        name="masterAgreementTypeName"
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
            label="Master Agreement Name"
            variant="outlined"
          />
        )}
      />
      <Controller
        name="dailyrateIndicator"
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
            label="Daily Rate Indicator"
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
        name="deadline"
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <DatePicker
              label="Deadline"
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
        name="teamdeadline"
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <DatePicker
              label="Team Deadline"
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
        name="workscontractdeadline"
        rules={{ required: true }}
        render={({ field }) => {
          return (
            <DatePicker
              label="Work Contract Deadline"
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

export default CreateMasterAgreement;
