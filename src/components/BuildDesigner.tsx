export type BuildLeadSnapshot = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

type BuildDesignerProps = {
  lead: BuildLeadSnapshot;
  onEditContact: () => void;
};

/** Step 2 shell only. Visual designer is not implemented yet. */
const BuildDesigner = ({ lead, onEditContact }: BuildDesignerProps) => {
  return (
    <div className="build-designer">
      <div className="build-designer-summary">
        <h2 className="build-designer-summary-title">Your details</h2>
        <dl className="build-designer-dl">
          <div className="build-designer-dl-row">
            <dt>Name</dt>
            <dd>{lead.name}</dd>
          </div>
          <div className="build-designer-dl-row">
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${encodeURIComponent(lead.email)}`}>
                {lead.email}
              </a>
            </dd>
          </div>
          <div className="build-designer-dl-row">
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${lead.phone.replace(/\s/g, "")}`}>{lead.phone}</a>
            </dd>
          </div>
          <div className="build-designer-dl-row build-designer-dl-row-notes">
            <dt>Notes</dt>
            <dd>
              {lead.notes.trim() ? lead.notes : "None added yet"}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          className="build-designer-edit-contact"
          onClick={onEditContact}
        >
          Edit contact details
        </button>
      </div>

      <div className="build-designer-canvas-wrap">
        <p className="build-designer-canvas-placeholder">
          Placeholder only. The interactive designer (preview, shapes, colors)
          will ship here later.
        </p>
      </div>
    </div>
  );
};

export default BuildDesigner;
