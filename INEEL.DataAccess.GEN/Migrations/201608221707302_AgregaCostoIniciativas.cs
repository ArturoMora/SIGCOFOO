namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AgregaCostoIniciativas : DbMigration
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
            
            AddColumn("GEN.Proyectos", "Costo", c => c.Decimal());
        }
        
        public override void Down()
        {
            //DropColumn("GEN.Proyectos", "Origen");
            //DropTable("dbo.Propuestas");
            //DropTable("dbo.Iniciativas");
        }
    }
}
