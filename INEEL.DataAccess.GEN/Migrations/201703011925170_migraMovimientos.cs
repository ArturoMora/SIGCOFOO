namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraMovimientos : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.MovimientoCategoria",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        Fecha = c.DateTime(nullable: false),
                        Categoria = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.MovimientoPuesto",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        Fecha = c.DateTime(nullable: false),
                        Puesto = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.MovimientoUnidadOrg",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ClavePersona = c.String(),
                        Fecha = c.DateTime(nullable: false),
                        ClaveUnidad = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.MovimientoUnidadOrg");
            DropTable("dbo.MovimientoPuesto");
            DropTable("dbo.MovimientoCategoria");
        }
    }
}
