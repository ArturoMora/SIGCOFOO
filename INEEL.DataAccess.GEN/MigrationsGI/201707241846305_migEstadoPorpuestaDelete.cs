namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migEstadoPorpuestaDelete : DbMigration
    {
        public override void Up()
        {
            DropTable("GI.cat_EstadoPropuesta");
        }
        
        public override void Down()
        {
            CreateTable(
                "GI.cat_EstadoPropuesta",
                c => new
                    {
                        Id = c.Int(nullable: false),
                        Nombre = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
    }
}
