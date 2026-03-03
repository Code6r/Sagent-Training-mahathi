import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';
import PageTransition from '../Common/PageTransition';
import LoadingSpinner from '../Common/LoadingSpinner';

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '10px',
  color: '#f1f5f9',
  fontSize: '14px',
  outline: 'none',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#94a3b8',
  marginBottom: '6px',
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const cloneForm = (value) => JSON.parse(JSON.stringify(value ?? {}));

const CrudPage = ({ config }) => {
  const {
    entityName,
    icon,
    gradient,
    idField,
    fetchFn,
    createFn,
    updateFn,
    deleteFn,
    emptyForm,
    columns,
    formFields,
    mapRowToForm,
    mapFormToPayload,
    fallbackData = [],
  } = config;

  const buildEmptyForm = () => cloneForm(emptyForm);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => buildEmptyForm());

  const title = useMemo(() => `${editing ? 'Edit' : 'Add'} ${entityName}`, [editing, entityName]);

  const fetchRows = async () => {
    try {
      const res = await fetchFn();
      const nextRows = Array.isArray(res?.data) ? res.data : [];
      setRows(nextRows);
    } catch {
      setRows(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // Fetch function comes from page config and is stable for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setEditing(false);
    setForm(buildEmptyForm());
  };

  const openCreate = () => {
    setEditing(false);
    setForm(buildEmptyForm());
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(true);
    const nextForm = typeof mapRowToForm === 'function'
      ? mapRowToForm(row)
      : { ...buildEmptyForm(), ...row };
    setForm(nextForm);
    setModalOpen(true);
  };

  const handleDelete = async (row) => {
    const id = row?.[idField];
    if (!id) return;

    if (!window.confirm(`Delete ${entityName} "${id}"?`)) return;

    try {
      await deleteFn(id);
      toast.success(`${entityName} deleted`);
      fetchRows();
    } catch {
      toast.error(`Failed to delete ${entityName.toLowerCase()}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = typeof mapFormToPayload === 'function' ? mapFormToPayload(form) : form;

    try {
      if (editing) {
        await updateFn(form[idField], payload);
        toast.success(`${entityName} updated`);
      } else {
        await createFn(payload);
        toast.success(`${entityName} created`);
      }
      fetchRows();
      closeModal();
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      toast.error(apiMessage || `Failed to save ${entityName.toLowerCase()}`);
    }
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field.key]: field.type === 'number' && value !== '' ? Number(value) : value,
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <PageTransition>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>{icon}</span>
          <div>
            <h2 style={{ margin: 0, color: '#f1f5f9', fontSize: '22px', fontWeight: 700 }}>{entityName}s</h2>
            <p style={{ margin: 0, marginTop: '4px', color: '#64748b', fontSize: '13px' }}>
              Total: {rows.length}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={openCreate}
          style={{
            background: gradient,
            border: 'none',
            color: 'white',
            padding: '12px 22px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Add {entityName}
        </motion.button>
      </motion.div>

      <DataTable columns={columns} data={rows} onEdit={openEdit} onDelete={handleDelete} />

      <Modal isOpen={modalOpen} onClose={closeModal} title={title}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formFields.map((field) => {
              const value = form?.[field.key] ?? '';
              const required = field.required !== false;
              const commonProps = {
                style: inputStyle,
                value,
                onChange: (e) => handleFieldChange(field, e.target.value),
                placeholder: field.placeholder || '',
                required,
                disabled: editing && field.isId,
              };

              return (
                <div key={field.key}>
                  <label style={labelStyle}>{field.label}</label>
                  {field.type === 'textarea' && <textarea {...commonProps} rows={4} />}
                  {field.type === 'select' && (
                    <select {...commonProps}>
                      {(field.options || []).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {!field.type || !['textarea', 'select'].includes(field.type) ? (
                    <input {...commonProps} type={field.type || 'text'} />
                  ) : null}
                </div>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={{
              width: '100%',
              marginTop: '24px',
              background: gradient,
              border: 'none',
              color: 'white',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {editing ? `Update ${entityName}` : `Create ${entityName}`}
          </motion.button>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default CrudPage;
