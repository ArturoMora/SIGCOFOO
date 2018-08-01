namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PersonalProyecto : DbMigration
    {
        public override void Up()
        {
            //CreateTable(
            //    "dbo.Iniciativas",
            //    c => new
            //        {
            //            FolioId = c.String(nullable: false, maxLength: 10),
            //            Titulo = c.String(maxLength: 200),
            //            ClaveEmpIniciativa = c.String(maxLength: 10),
            //            Fecha = c.DateTime(nullable: false),
            //            UnidadOrganizacionalId = c.String(maxLength: 10),
            //            SubPrograma = c.String(maxLength: 10),
            //            Estado = c.Boolean(nullable: false),
            //            Origen = c.String(maxLength: 10),
            //            Costo = c.Single(),
            //        })
            //    .PrimaryKey(t => t.FolioId);
            
            //CreateTable(
            //    "dbo.Propuestas",
            //    c => new
            //        {
            //            PropuestaId = c.String(nullable: false, maxLength: 10),
            //            Titulo = c.String(maxLength: 200),
            //            ClaveEmpPropuesta = c.String(maxLength: 10),
            //            Fecha = c.DateTime(nullable: false),
            //            UnidadOrganizacionalId = c.String(maxLength: 10),
            //            SubPrograma = c.String(maxLength: 10),
            //            Estado = c.Boolean(nullable: false),
            //            Origen = c.String(maxLength: 10),
            //            Costo = c.Single(),
            //        })
            //    .PrimaryKey(t => t.PropuestaId);
            
            AddColumn("GEN.PersonalProyecto", "FechaInicio", c => c.DateTime(nullable: false));
            AddColumn("GEN.PersonalProyecto", "FechaTermino", c => c.DateTime(nullable: false));
            AddColumn("GEN.PersonalProyecto", "Participacion", c => c.String());
            AddColumn("GEN.PersonalProyecto", "DescripcionActividades", c => c.String(maxLength: 300));
            AddColumn("GEN.PersonalProyecto", "AdjuntoId", c => c.Long());
            //AddColumn("GEN.Proyectos", "Origen", c => c.String(maxLength: 10));
            CreateIndex("GEN.PersonalProyecto", "AdjuntoId");
            AddForeignKey("GEN.PersonalProyecto", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.PersonalProyecto", "AdjuntoId", "GEN.Adjunto");
            DropIndex("GEN.PersonalProyecto", new[] { "AdjuntoId" });
            DropColumn("GEN.Proyectos", "Origen");
            DropColumn("GEN.PersonalProyecto", "AdjuntoId");
            DropColumn("GEN.PersonalProyecto", "DescripcionActividades");
            DropColumn("GEN.PersonalProyecto", "Participacion");
            DropColumn("GEN.PersonalProyecto", "FechaTermino");
            DropColumn("GEN.PersonalProyecto", "FechaInicio");
            DropTable("dbo.Propuestas");
            DropTable("dbo.Iniciativas");
        }
    }
}
