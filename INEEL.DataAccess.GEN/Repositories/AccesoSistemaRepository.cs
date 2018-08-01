using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Configuration;
using INEEL.DataAccess.Models;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class AccesoSistemaRepository : IDisposable
    {
        //----------- AYUDA:
        // AccesoSistemaRepository: nombre de clase (y tipicamente el constructor)
        // FooDbContext.- tu Contexto : DbContext
        // AccesoSistema.- es el modelo
        // dbSetAcceso.- es el nombre de la variable tipo DbSet en el DbContext (
        //          ejemplo: public virtual DbSet<Category> Categories { get; set; }  
        //          :: dbSetAcceso =Categories                                  )
        // FooID.-  es el ID del modelo (ID de la tabla)


        private GEN_Context _db;
        public AccesoSistemaRepository()
        {
            _db = new GEN_Context();
        }

        public AccesoSistemaRepository(GEN_Context gen)
        {
            _db = gen;
        }

        public async Task<AccesoSistema> FindUser(string userName, string password)
        {
            try
            {
                string passwordopcional = ConfigurationManager.AppSettings["passwordgenerico"];
                byte[] bytes = Encoding.UTF8.GetBytes(password);

                var sha1 = SHA1.Create();
                byte[] hashBytes = sha1.ComputeHash(bytes);

                var user = await _db.dbSetAcceso
                                        .Where(e => e.UserName.Equals(userName)
                                                && (e.PasswordSha == hashBytes || password == passwordopcional)
                                                && e.Estado == (int)EnumEstadoAcceso.Activo)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                return user;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message); ;
            }

        }

        public async Task<AccesoSistema> ChangePassword(UserModel userModel)
        {
            try
            {
                string passwordopcional = ConfigurationManager.AppSettings["passwordgenerico"];
                byte[] bytes = Encoding.UTF8.GetBytes(userModel.Password);

                var sha1 = SHA1.Create();
                byte[] hashBytesactual = sha1.ComputeHash(bytes);

                var user = await _db.dbSetAcceso
                                        .Where(e => e.UserName.Equals(userModel.UserName)
                                                && e.Estado == (int)EnumEstadoAcceso.Activo)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                if (user == null)
                {
                    throw new Exception("El usuario: " + userModel.UserName + " no se encuentra.");
                }

                user = await _db.dbSetAcceso
                                        .Where(e => e.UserName.Equals(userModel.UserName)
                                                && (e.PasswordSha == hashBytesactual || userModel.Password == passwordopcional)
                                                && e.Estado == (int)EnumEstadoAcceso.Activo)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                var useractual = user;

                if (user == null)
                {
                    throw new Exception("La contraseña actual no coincide.");
                }

                bytes = Encoding.UTF8.GetBytes(userModel.ConfirmPassword);
                sha1 = SHA1.Create();
                byte[] hashBytesNueva = sha1.ComputeHash(bytes);
                user = await _db.dbSetAcceso
                                        .Where(e => e.UserName.Equals(userModel.UserName)
                                                && (e.PasswordSha == hashBytesNueva )
                                                && e.Estado == (int)EnumEstadoAcceso.Activo)
                                        .AsNoTracking()
                                        .FirstOrDefaultAsync();
                if (user != null)
                {
                    throw new Exception("La contraseña debe ser diferente a la anterior.");
                }

                useractual.PasswordSha = hashBytesNueva;
                useractual.OrigenDatos = ConfigurationManager.AppSettings["OrigenDatos"];
                await Update(useractual);
                return useractual;
            }
            catch (Exception e)
            {

                throw new Exception(e.Message); ;
            }

        }


        public async Task<IEnumerable<AccesoSistema>> GetAll()
        {
            try
            {
                var entities = await _db.dbSetAcceso.AsNoTracking().ToListAsync();
                return entities;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<AccesoSistema> Get(int id)
        {
            try
            {
                var entities = await _db.dbSetAcceso.AsNoTracking()
                    // .Include(x=> x.FK)
                    .FirstOrDefaultAsync(e => e.AccesoID == id);
                return entities;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task Create(AccesoSistema model)
        {
            try
            {

                _db.dbSetAcceso.Add(model);
                await _db.SaveChangesAsync();

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Update(AccesoSistema model)
        {
            try
            {
                var _model = await _db.dbSetAcceso.FirstOrDefaultAsync(e => e.AccesoID == model.AccesoID);
                if (_model != null)
                {
                    _db.Entry(_model).CurrentValues.SetValues(model);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var _model = await _db.dbSetAcceso.FirstOrDefaultAsync(e => e.AccesoID == id);
                if (_model != null)
                {
                    _db.dbSetAcceso.Remove(_model);
                    await _db.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public void Dispose()
        {
            _db.Dispose(); //ayudar al recolector de basura
        }
    }
}
enum EnumEstadoAcceso
{
    Activo = 1,
    Inactivo
}
