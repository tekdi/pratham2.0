import Loader from "@/components/Loader";
import coursePlannerStore from "@/store/coursePlannerStore";
import taxonomyStore from "@/store/tanonomyStore";
import {
  getDropdownCategories,
  getValidTermsForCategory,
  getValidSubjects,
  SelectionEntry,
} from "@/utils/frameworkTaxonomy";
import { TelemetryEventType } from "@/utils/app.constant";
import { telemetryFactory } from "@/utils/telemetry";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Card as MuiCard,
  Select,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "coursePlannerSelections";
const BOARD_CATEGORY_CODE = "board";

const SubjectDetails = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { boardDetails, boardName } = router.query as {
    boardDetails?: any;
    boardName?: any;
  };
  const store = coursePlannerStore();
  const [loading, setLoading] = useState(true);
  const setTaxanomySubject = coursePlannerStore(
    (state) => state.setTaxanomySubject
  );
  const setTaxonomyBoard = taxonomyStore((state) => state.setBoard);
  const setTaxonomyMedium = taxonomyStore((state) => state.setTaxonomyMedium);
  const setTaxonomyGrade = taxonomyStore((state) => state.setTaxonomyGrade);
  const setTaxonomyType = taxonomyStore((state) => state.setTaxonomyType);
  const setTaxonomySubject = taxonomyStore((state) => state.setTaxonomySubject);

  const framework = store?.framedata;

  // selections keyed by category.code -> term.code, for every dynamically rendered dropdown
  const [selections, setSelections] = useState<Record<string, string>>({});

  // Board is already resolved on this page via the route (chosen on the previous
  // board-picker page), so it's excluded here in addition to the universally-special
  // "subject" category that getDropdownCategories already excludes.
  const dropdownCategories = useMemo(
    () =>
      getDropdownCategories(framework).filter(
        (cat: any) => cat.code !== BOARD_CATEGORY_CODE
      ),
    [framework]
  );

  // All selections known so far, including the board (fed from the route, not a rendered dropdown)
  const allEntries: SelectionEntry[] = useMemo(() => {
    const entries: SelectionEntry[] = [];
    if (boardDetails) {
      entries.push({ categoryCode: BOARD_CATEGORY_CODE, termCode: boardDetails });
    }
    Object.entries(selections).forEach(([categoryCode, termCode]) => {
      if (termCode) entries.push({ categoryCode, termCode });
    });
    return entries;
  }, [boardDetails, selections]);

  const optionsByCategory = useMemo(() => {
    const map: Record<string, any[]> = {};
    dropdownCategories.forEach((cat: any) => {
      const entriesExcludingSelf = allEntries.filter(
        (e) => e.categoryCode !== cat.code
      );
      map[cat.code] = getValidTermsForCategory(
        framework,
        entriesExcludingSelf,
        cat.code
      );
    });
    return map;
  }, [framework, allEntries, dropdownCategories]);

  const allCategoriesSelected =
    dropdownCategories.length > 0 &&
    dropdownCategories.every((cat: any) => !!selections[cat.code]);

  const subject: string[] = useMemo(() => {
    if (!framework || !allCategoriesSelected) return [];
    const subjectTerms = getValidSubjects(framework, allEntries);
    return subjectTerms.map((term: any) => term.name).sort((a, b) => a.localeCompare(b));
  }, [framework, allEntries, allCategoriesSelected]);

  // Load persisted selections once framework/dropdownCategories are known,
  // and reset selections whenever the board changes.
  useEffect(() => {
    if (!boardDetails && !boardName) return;
    setSelections({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
    setTaxonomyMedium("");
    setTaxonomyGrade("");
    setTaxonomyType("");
  }, [boardDetails, boardName]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.selections) setSelections(parsed.selections);
      }
    } catch {
      // ignore malformed storage
    }
    setLoading(false);
  }, []);

  const persistSelections = (next: Record<string, string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ selections: next }));
    } catch {
      // ignore storage errors
    }
  };

  const fireCategoryChangeTelemetry = (categoryCode: string) => {
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, "");
    const env = cleanedUrl.split("/")[0];

    telemetryFactory.interact({
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id: `change-${categoryCode}`,
        type: TelemetryEventType.CLICK,
        subtype: "",
        pageid: cleanedUrl,
      },
    });
  };

  // Mirror selection changes into the legacy taxonomy store where applicable,
  // so downstream pages (e.g. importCsv) that read medium/grade/type continue to work.
  const syncTaxonomyStore = (categoryCode: string, termName: string) => {
    if (categoryCode === "medium") setTaxonomyMedium(termName);
    else if (categoryCode === "gradeLevel") setTaxonomyGrade(termName);
    else if (categoryCode === "courseType") setTaxonomyType(termName);
  };

  const buildEntriesExcluding = (selections: Record<string, string>, excludeCode: string) => {
    const entries: SelectionEntry[] = [];
    if (boardDetails) {
      entries.push({ categoryCode: BOARD_CATEGORY_CODE, termCode: boardDetails });
    }
    Object.entries(selections).forEach(([c, term]) => {
      if (term && c !== excludeCode) entries.push({ categoryCode: c, termCode: term });
    });
    return entries;
  };

  const invalidateStaleLaterSelections = (
    next: Record<string, string>,
    categoryCode: string
  ) => {
    const orderedCodes = dropdownCategories.map((c: any) => c.code);
    const idx = orderedCodes.indexOf(categoryCode);

    orderedCodes.slice(idx + 1).forEach((laterCode: string) => {
      if (!next[laterCode]) return;
      const entries = buildEntriesExcluding(next, laterCode);
      const validTerms = getValidTermsForCategory(framework, entries, laterCode);
      const stillValid = validTerms.some((term: any) => term.code === next[laterCode]);
      if (!stillValid) {
        next[laterCode] = "";
        syncTaxonomyStore(laterCode, "");
      }
    });
  };

  const handleCategoryChange = (categoryCode: string) => (event: any) => {
    const termCode = event.target.value;

    setSelections((prev) => {
      const next: Record<string, string> = { ...prev, [categoryCode]: termCode };
      invalidateStaleLaterSelections(next, categoryCode);
      persistSelections(next);
      return next;
    });

    const selectedTerm = (optionsByCategory[categoryCode] || []).find(
      (term: any) => term.code === termCode
    );
    syncTaxonomyStore(categoryCode, selectedTerm?.name || "");
    fireCategoryChangeTelemetry(categoryCode);
  };

  // Auto-select any category whose currently valid option set has exactly one
  // entry, regardless of category order — the valid set is already narrowed by
  // whatever else is selected so far, so no extra ordering gate is needed.
  useEffect(() => {
    dropdownCategories.forEach((cat: any) => {
      const opts = optionsByCategory[cat.code] || [];

      if (!selections[cat.code] && opts.length === 1) {
        const term = opts[0];
        setSelections((prev) => {
          if (prev[cat.code] === term.code) return prev;
          const next = { ...prev, [cat.code]: term.code };
          persistSelections(next);
          return next;
        });
        syncTaxonomyStore(cat.code, term.name);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsByCategory, dropdownCategories]);

  if (loading) {
    return <Loader showBackdrop={true} loadingText="Loading" />;
  }

  const handleBackClick = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
    setTaxonomySubject("");
    setTaxonomyGrade("");
    setTaxonomyMedium("");
    setTaxonomyType("");
    setTaxonomyBoard("");

    router.back();
  };

  const handleCardClick = (subj: string) => {
    setTaxonomySubject(subj);
    router.push(`/importCsv?subject=${encodeURIComponent(subj)}`);

    setTaxanomySubject(subj);
  };

  const handleReset = () => {
    setSelections({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
    setTaxonomyMedium("");
    setTaxonomyGrade("");
    setTaxonomyType("");
  };

  const getCategoryLabel = (category: any) => {
    const key = `COURSE_PLANNER.SELECT_${String(category.code).toUpperCase()}`;
    return t(key, { defaultValue: `Select ${category.name}` });
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ marginTop: "20px" }}>
        {dropdownCategories.map((cat: any) => (
          <Grid item xs={12} sm={3} md={3} lg={3} xl={3} key={cat.code}>
            <Select
              value={selections[cat.code] || ""}
              onChange={handleCategoryChange(cat.code)}
              displayEmpty
              inputProps={{ "aria-label": cat.name }}
              sx={{
                "& .MuiSelect-select": {
                  padding: "8px 16px",
                  textAlign: "left",
                },
                "& fieldset": {
                  border: "none",
                },
                border: "1px solid #3C3C3C",
                borderRadius: "8px",
                marginRight: "16px",
                height: 40,
                width: "100%",
              }}
            >
              <MenuItem value="">
                <Typography>{getCategoryLabel(cat)}</Typography>
              </MenuItem>
              {(optionsByCategory[cat.code] || []).map((term: any) => (
                <MenuItem key={term.code} value={term.code}>
                  {term.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        ))}
        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
          <Button
            onClick={handleReset}
            sx={{
              height: 40,
              backgroundColor: "#4D4639",
              color: "#FFFFFF",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "black",
              },
              width: "100%",
            }}
          >
            {t("COURSE_PLANNER.CLEAR_SELECTION")}
          </Button>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginTop: "16px",
          marginBottom: "16px",
          gap: "5px",
          width: "fit-content",
          cursor: "pointer",
        }}
        onClick={handleBackClick}
      >
        <ArrowBackIcon />

        <Typography variant="h2">{boardName}</Typography>
        <Box sx={{ width: "40px", height: "40px" }}></Box>
      </Box>
      <Divider />

      <Box sx={{ marginTop: "16px" }}>
        <Grid container spacing={2}>
          {subject && subject.length > 0 ? (
            subject.map((subj: string, index: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <MuiCard
                  key={index}
                  sx={{
                    padding: "14px",
                    cursor: "pointer",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#EAF2FF",
                      transform: "scale(1.02)",
                    },
                  }}
                  onClick={() => handleCardClick(subj)}
                >
                  {/* Left Section: Folder Icon and Subject Name */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FolderOutlinedIcon sx={{ color: "#3C3C3C" }} />
                    <Typography variant="h6" noWrap>
                      {subj || "Untitled Subject"}
                    </Typography>
                  </Box>
                </MuiCard>
              </Grid>
            ))
          ) : (
            <Typography
              variant="h4"
              align="center"
              sx={{ marginTop: "24px", color: "#6B7280", mx: "16px" }}
            >
              {t("COURSE_PLANNER.SELECT_ALL_MESSSAGE")}
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default SubjectDetails;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
