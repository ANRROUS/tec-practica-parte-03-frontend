'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { apiService } from '@/lib/api';
import { Caso } from '@/types';
import { casoSchema } from '@/lib/validations';
import { z } from 'zod';

export default function ExpedientesPage() {
  const router = useRouter();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCaso, setEditingCaso] = useState<Caso | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'A' as 'A' | 'P' | 'C' | 'S'
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [casoToDelete, setCasoToDelete] = useState<Caso | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    setUser(authService.getUser());
    loadCasos(true);
  }, [router]);

  const loadCasos = async (showSkeleton = false) => {
    try {
      if (showSkeleton) {
        setLoading(true);
      }
      const data = await apiService.getCasos();
      setCasos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los expedientes');
    } finally {
      if (showSkeleton) {
        setLoading(false);
      }
    }
  };

  const openCreateModal = () => {
    setEditingCaso(null);
    setFormData({ title: '', description: '', status: 'A' });
    setShowModal(true);
  };

  const openEditModal = (caso: Caso) => {
    setEditingCaso(caso);
    setFormData({
      title: caso.title,
      description: caso.description,
      status: caso.status
    });
    setShowModal(true);
  };

  const openDeleteModal = (caso: Caso) => {
    setCasoToDelete(caso);
    setShowDeleteModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCaso(null);
    setFormData({ title: '', description: '', status: 'A' });
    setValidationErrors({});
    setError('');
    setSuccess('');
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCasoToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});
    setActionLoading(true);
    
    try {
      // Validar con Zod
      const validatedData = casoSchema.parse(formData);
      
      if (editingCaso) {
        await apiService.updateCaso(editingCaso.id, validatedData);
        setSuccess('Expediente actualizado exitosamente');
      } else {
        await apiService.createCaso(validatedData);
        setSuccess('Expediente creado exitosamente');
      }
      
      setTimeout(() => {
        closeModal();
        loadCasos();
      }, 1000);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue: any) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setValidationErrors(errors);
      } else {
        setError(err.message || 'Error al procesar el expediente');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!casoToDelete) return;
    setError('');
    setSuccess('');
    setActionLoading(true);
    
    try {
      await apiService.deleteCaso(casoToDelete.id);
      await loadCasos();
      setSuccess('Expediente eliminado exitosamente');
      closeDeleteModal();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el expediente');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      A: 'Activo',
      P: 'En Proceso',
      C: 'Cerrado',
      S: 'Suspendido'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      A: 'bg-green-50 text-green-700 border border-green-200',
      P: 'bg-blue-50 text-blue-700 border border-blue-200',
      C: 'bg-gray-50 text-gray-700 border border-gray-200',
      S: 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#1c0538' }}></div>
          <p className="mt-4 text-gray-600">Cargando expedientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#1c0538' }}></div>
            <span className="text-gray-700 font-medium">Procesando...</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Welcome */}
        {user && (
          <div className="mb-6">
            <p className="text-gray-600">
              Bienvenido, <span className="font-semibold" style={{ color: '#1c0538' }}>{user.full_name}</span>
            </p>
          </div>
        )}

        {/* Actions Bar */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Mis Expedientes <span className="text-gray-500">({casos.length})</span>
          </h2>
          <button
            onClick={openCreateModal}
            disabled={actionLoading}
            className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition font-semibold shadow-lg disabled:opacity-50"
            style={{ backgroundColor: '#1c0538' }}
          >
            + Nuevo Expediente
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded shadow">
            <p className="font-semibold">Éxito</p>
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Casos Table */}
        {casos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2" style={{ borderColor: '#1c053820' }}>
            <p className="text-gray-500 text-lg font-medium">
              No tienes expedientes creados
            </p>
            <p className="text-gray-400 mt-2">
              ¡Crea tu primer expediente usando el botón de arriba!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border" style={{ borderColor: '#1c053820' }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="text-white" style={{ backgroundColor: '#1c0538' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {casos.map((caso) => (
                  <tr key={caso.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {caso.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md truncate">
                        {caso.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(caso.status)}`}>
                        {getStatusLabel(caso.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(caso.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(caso)}
                        disabled={actionLoading}
                        className="hover:opacity-80 mr-4 font-semibold disabled:opacity-50"
                        style={{ color: '#1c0538' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => openDeleteModal(caso)}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border-2" style={{ borderColor: '#1c0538' }} onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b-2" style={{ borderColor: '#1c053820' }}>
              <h3 className="text-2xl font-bold" style={{ color: '#1c0538' }}>
                {editingCaso ? 'Editar Expediente' : 'Nuevo Expediente'}
              </h3>
            </div>
            
            {/* Success/Error in Modal */}
            <div className="px-6 pt-4">
              {success && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
                  <p className="text-sm">{success}</p>
                </div>
              )}
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1c0538' }}>
                  Título del Expediente
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors"
                  style={{ color: '#0f0228' }}
                  onFocus={(e) => e.target.style.borderColor = '#1c0538'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="Ej: Caso de Divorcio - Sr. Pérez"
                />
                {validationErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1c0538' }}>
                  Descripción Detallada
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors resize-none"
                  style={{ color: '#0f0228' }}
                  onFocus={(e) => e.target.style.borderColor = '#1c0538'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="Describe el expediente con todos los detalles relevantes..."
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1c0538' }}>
                  Estado del Caso
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors cursor-pointer"
                  style={{ color: '#0f0228' }}
                  onFocus={(e) => e.target.style.borderColor = '#1c0538'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="A">Activo</option>
                  <option value="P">En Proceso</option>
                  <option value="C">Cerrado</option>
                  <option value="S">Suspendido</option>
                </select>
                {validationErrors.status && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.status}</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t-2" style={{ borderColor: '#1c053820' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="px-6 py-3 border-2 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                  style={{ color: '#1c0538', borderColor: '#1c0538' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2"
                  style={{ backgroundColor: '#1c0538' }}
                >
                  {actionLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {actionLoading ? 'Procesando...' : (editingCaso ? 'Guardar Cambios' : 'Crear Expediente')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && casoToDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeDeleteModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-2" style={{ borderColor: '#1c0538' }} onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b-2" style={{ borderColor: '#1c053820' }}>
              <h3 className="text-2xl font-bold" style={{ color: '#1c0538' }}>
                Eliminar expediente
              </h3>
            </div>
            <div className="px-6 py-6 space-y-4">
              <p className="text-gray-600">
                ¿Estás seguro de que deseas eliminar el expediente
                {' '}
                <span className="font-semibold" style={{ color: '#1c0538' }}>
                  {casoToDelete.title}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
              <div className="bg-gray-50 border rounded-lg px-4 py-3" style={{ borderColor: '#1c053820' }}>
                <p className="text-sm text-gray-500">
                  Se eliminarán todos los datos asociados y no podrás recuperarlos.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={actionLoading}
                className="px-6 py-3 border-2 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                style={{ color: '#1c0538', borderColor: '#1c0538' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-6 py-3 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2 hover:opacity-90 transition"
                style={{ backgroundColor: '#1c0538' }}
              >
                {actionLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
