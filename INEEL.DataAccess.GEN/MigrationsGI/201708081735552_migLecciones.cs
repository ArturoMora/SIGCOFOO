namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migLecciones : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GI.tab_TecnologiaLicenciadaLecciones",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Comentario = c.String(nullable: false),
                        Fecha = c.DateTime(nullable: false),
                        Tipo = c.Int(nullable: false),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("GI.tab_TecnologiaLicenciadaLecciones");
        }
    }
}
