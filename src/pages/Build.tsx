import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import BuildLeadForm, {
  type BuildLeadCompletePayload,
} from "../components/BuildLeadForm";
import BuildDesigner, {
  type BuildLeadSnapshot,
} from "../components/BuildDesigner";
import { BUILD_SUCCESS_TO_BUILDER_DELAY_MS } from "../../lib/constants";

type Phase = "lead" | "builder";

const LEAVE_BUILD_MESSAGE =
  "Leave this page? You may lose build progress that is not saved elsewhere.";

const Build = () => {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("lead");
  const [buildRequestId, setBuildRequestId] = useState<string | null>(null);
  const [leadSnapshot, setLeadSnapshot] = useState<BuildLeadSnapshot | null>(
    null
  );
  const [leadFormDirty, setLeadFormDirty] = useState(false);
  const transitionTimerRef = useRef<number | null>(null);

  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTransitionTimer(), [clearTransitionTimer]);

  const atRisk =
    phase === "builder" || Boolean(buildRequestId) || leadFormDirty;

  useEffect(() => {
    if (!atRisk || typeof window === "undefined") return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [atRisk]);

  useEffect(() => {
    if (!atRisk) return;

    const onRouteChangeStart = (url: string) => {
      if (url.split("?")[0] === router.asPath.split("?")[0]) return;
      if (!window.confirm(LEAVE_BUILD_MESSAGE)) {
        router.events.emit(
          "routeChangeError",
          new Error("Route change aborted by user"),
          router.asPath
        );
        throw new Error("Route change aborted");
      }
    };

    router.events.on("routeChangeStart", onRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
    };
  }, [atRisk, router]);

  const handleLeadFormDirty = useCallback((dirty: boolean) => {
    setLeadFormDirty(dirty);
  }, []);

  const handleLeadComplete = useCallback(
    (data: BuildLeadCompletePayload) => {
      setLeadFormDirty(false);
      setBuildRequestId(data.id);
      setLeadSnapshot({
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes,
      });
      clearTransitionTimer();
      transitionTimerRef.current = window.setTimeout(() => {
        setPhase("builder");
        transitionTimerRef.current = null;
      }, BUILD_SUCCESS_TO_BUILDER_DELAY_MS);
    },
    [clearTransitionTimer]
  );

  const handleEditContact = useCallback(() => {
    clearTransitionTimer();
    setPhase("lead");
  }, [clearTransitionTimer]);

  return (
    <div className="build-page">
      <p className="build-page-wip-banner" role="status">
        <strong>Work in progress.</strong> This custom build experience is still
        under construction and is not the final way to order yet. When you are
        ready to order, please use our{" "}
        <Link href="/contact">contact form</Link>.
      </p>
      <h1>Build</h1>

      {atRisk ? (
        <p className="build-page-exit-warning" role="status">
          If you close this tab, refresh, or go to another page on this site,
          you can lose build progress. There is no customer login yet, so
          nothing is kept on this device after you leave.
        </p>
      ) : null}

      {phase === "lead" ? (
        <>
          <p className="build-page-lead">
            Start by telling us how to reach you. The visual designer opens
            right after, and your details stay visible beside it.
          </p>
          <p className="build-page-crosslink">
            Prefer not to use the builder? You can still reach out with the
            regular{" "}
            <Link href="/contact">contact and consultation form</Link> instead.
          </p>
          <BuildLeadForm
            onLeadComplete={handleLeadComplete}
            onDirtyChange={handleLeadFormDirty}
            defaultLead={
              leadSnapshot && phase === "lead" ? leadSnapshot : undefined
            }
            existingBuildRequestId={
              buildRequestId && phase === "lead" ? buildRequestId : null
            }
          />
        </>
      ) : (
        leadSnapshot &&
        buildRequestId && (
          <>
            <p className="build-page-lead build-page-lead-step2">
              Design your order below. Your details stay above the step list;
              start by choosing a pastry type (icons). More steps follow by
              pastry.
            </p>
            <BuildDesigner
              buildRequestId={buildRequestId}
              lead={leadSnapshot}
              onEditContact={handleEditContact}
            />
          </>
        )
      )}
    </div>
  );
};

export default Build;
