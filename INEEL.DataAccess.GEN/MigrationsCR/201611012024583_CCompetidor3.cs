namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CCompetidor3 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_ServicioPorProveedor", "ServicioId", "CR.cat_Servicio");
            DropIndex("CR.tab_ServicioPorProveedor", new[] { "ServicioId" });
            DropColumn("CR.tab_ServicioPorProveedor", "ServicioId");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_ServicioPorProveedor", "ServicioId", c => c.Int(nullable: false));
            CreateIndex("CR.tab_ServicioPorProveedor", "ServicioId");
            AddForeignKey("CR.tab_ServicioPorProveedor", "ServicioId", "CR.cat_Servicio", "ServicioId", cascadeDelete: true);
        }
    }
}
