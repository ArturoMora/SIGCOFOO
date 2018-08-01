namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CCompetidor7 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_ServicioPorCompetidor", "Proveedor_ProveedorId", "CR.tab_Proveedor");
            DropIndex("CR.tab_ServicioPorCompetidor", new[] { "Proveedor_ProveedorId" });
            //DropColumn("CR.tab_ServicioPorCompetidor", "Proveedor_ProveedorId");
        }
        
        public override void Down()
        {
            //AddColumn("CR.tab_ServicioPorCompetidor", "Proveedor_ProveedorId", c => c.Int());
            CreateIndex("CR.tab_ServicioPorCompetidor", "Proveedor_ProveedorId");
            AddForeignKey("CR.tab_ServicioPorCompetidor", "Proveedor_ProveedorId", "CR.tab_Proveedor", "ProveedorId");
        }
    }
}
