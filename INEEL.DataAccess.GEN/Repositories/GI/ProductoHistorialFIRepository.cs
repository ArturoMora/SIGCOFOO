using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GI;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Repositories.GI
{
    public class ProductoHistorialFIRepository
    {
        private GI_Context context;

        public ProductoHistorialFIRepository()
        {
            context = new GI_Context();
        }

        public async Task <ICollection<ProductoHistorialFI>> GetAll()
        {
            try
            {
                var entities = await context.DbSetProductoHistorialFI.AsNoTracking().ToListAsync();
                return entities;
            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task <Object> GetHistorialByProducto(int id)
        {
            try
            {
                var entitie = await context.DbSetProductoHistorialFI.Where(e => e.ProductoId == id).AsNoTracking().FirstOrDefaultAsync();
                return entitie;
            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task <Object> GetHistorialBySolicitud(int id)
        {
            try
            {
                var entitie = await context.DbSetProductoHistorialFI.Where(e => e.SolicitudId == id).AsNoTracking().FirstOrDefaultAsync();
                return entitie;

            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Create(ProductoHistorialFI model)
        {
            try
            {
                context.DbSetProductoHistorialFI.Add(model);
                await context.SaveChangesAsync();
            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }

        }

        public async Task AddComentario(ProductoHistorialFI model){
            try{
                var _registro= await context.DbSetProductoHistorialFI.FirstOrDefaultAsync(e=> e.SolicitudId == model.SolicitudId);
                if(_registro!=null){
                    // var registroActualizado= _registro;
                    switch(model.etapaEvaluacion){
                        case "Gerencia":
                            _registro.ComentarioGerencia= model.ComentarioGerencia;
                            _registro.EvaluacionGerencia=model.EvaluacionGerencia;
                            _registro.FechaEvaluacionGerencia= DateTime.Today;
                        break;

                        case "Preliminares":
                            _registro.ComentarioPreliminar= model.ComentarioPreliminar;
                            _registro.EvaluacionPreliminar= model.EvaluacionPreliminar;
                            _registro.FechaEvaluacionPreliminar= DateTime.Today;
                        break;

                        case "Final":
                            _registro.ComentarioFinal= model.ComentarioFinal;
                            _registro.EvaluacionFinal= model.EvaluacionFinal;
                            _registro.FechaEvaluacionFinal= DateTime.Today;
                        break;
                    }

                    // context.Entry(_registro).CurrentValues.SetValues(registroActualizado);
                    await context.SaveChangesAsync();
                }

            }catch (Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task<Object> GetJustificacionSolicitudRechazada(int id){
            try{
                var solicitudId= await context.DbSetProductoHistorialFI.AsNoTracking().Where(e=> e.ProductoId== id).Select(x=> x.SolicitudId).FirstOrDefaultAsync();
                if(solicitudId!=0){
                    var datosSolicitud= await context.DbSetBitacoraSolicitudesGI
                            .Where(e=> e.SolicitudId== solicitudId && e.Descripcion.Contains("Se rechazó la solicitud"))
                            .OrderByDescending(e=> e.FechaMovimiento)
                            .AsNoTracking().FirstOrDefaultAsync();

                    return datosSolicitud;
                }
                return null;
            }catch(Exception e){
                throw new Exception(e.Message,e);
            }
        }

        public async Task Update(ProductoHistorialFI model)
        {
            try
            {
                var _model = await context.DbSetProductoHistorialFI.FirstOrDefaultAsync(e => e.Id == model.Id);
                if (_model != null)
                {
                    context.Entry(_model).CurrentValues.SetValues(model);
                    await context.SaveChangesAsync();
                }

            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task Delete (int id)
        {
            try
            {
                var _model = await context.DbSetProductoHistorialFI.FirstOrDefaultAsync(e => e.Id == id);
                if (_model != null)
                {
                    context.DbSetProductoHistorialFI.Remove(_model);
                    await context.SaveChangesAsync();
                }

            }catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

    }
}
