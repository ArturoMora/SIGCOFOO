namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ah3 : DbMigration
    {
        public override void Up()
        {
            //DropColumn("GEN.Proyectos", "Origen");
            //DropTable("dbo.Iniciativas");
            //DropTable("dbo.Propuestas");
        }
        
        public override void Down()
        {
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
            
            //AddColumn("GEN.Proyectos", "Origen", c => c.String(maxLength: 10));
        }
    }
}
