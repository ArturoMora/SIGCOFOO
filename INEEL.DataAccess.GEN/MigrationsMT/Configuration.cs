namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using MT.Models.ITF.catalogos;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<INEEL.DataAccess.GEN.Contexts.MT_Context>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            MigrationsDirectory = @"MigrationsMT";
        }

        protected override void Seed(INEEL.DataAccess.GEN.Contexts.MT_Context context)
        {
            //context.dbSetCAT_TipoAcceso.AddOrUpdate(
            //       new TipoAcceso { TipoAccesoId = 1, Nombre = "Público", EstadoDisponible=true},
            //       new TipoAcceso { TipoAccesoId = 2, Nombre = "Reservado", EstadoDisponible=true}
            //       );

            //context.dbSetCAT_CalificacionCliente.AddOrUpdate(
            //new CalificacionCliente { CalificacionClienteId = 1, Nombre = "Bajo", NombreCorto = "Bajo", Estado = 1, FechaAlta = DateTime.Now },
            //new CalificacionCliente { CalificacionClienteId = 2, Nombre = "Medio", NombreCorto = "Medio", Estado = 1, FechaAlta = DateTime.Now },
            //new CalificacionCliente { CalificacionClienteId = 3, Nombre = "Alto", NombreCorto = "Alto", Estado = 1, FechaAlta = DateTime.Now }

            //);
            ////Deficiente, Cumplió, Excedió.
            //context.dbSetCAT_CalificacionPersonal.AddOrUpdate(
            //new CalificacionPersonal { CalificacionPersonalId = 1, Nombre = "Deficiente", NombreCorto = "Deficiente", Estado = 1, FechaAlta = DateTime.Now },
            //new CalificacionPersonal { CalificacionPersonalId = 2, Nombre = "Cumplió", NombreCorto = "Cumplió", Estado = 1, FechaAlta = DateTime.Now },
            //new CalificacionPersonal { CalificacionPersonalId = 3, Nombre = "Excedió", NombreCorto = "Excedió", Estado = 1, FechaAlta = DateTime.Now }
            //);
            //// I, II, III, IV.
            //context.dbSetCAT_CalifResultadosFinancieros.AddOrUpdate(
            //new CalifResultadosFinancieros { CalifResultadosFinancierosId = 1, Nombre = "I", NombreCorto = "I", Estado = 1, FechaAlta = DateTime.Now },
            //new CalifResultadosFinancieros { CalifResultadosFinancierosId = 2, Nombre = "II", NombreCorto = "II", Estado = 1, FechaAlta = DateTime.Now },
            //new CalifResultadosFinancieros { CalifResultadosFinancierosId = 3, Nombre = "III", NombreCorto = "III", Estado = 1, FechaAlta = DateTime.Now },
            //new CalifResultadosFinancieros { CalifResultadosFinancierosId = 4, Nombre = "IV", NombreCorto = "IV", Estado = 1, FechaAlta = DateTime.Now }
            //);
        }
    }
}
