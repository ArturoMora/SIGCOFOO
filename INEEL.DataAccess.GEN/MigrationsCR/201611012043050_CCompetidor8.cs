namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CCompetidor8 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_ProductoPorCompetidor", "Proveedor_ProveedorId", "CR.tab_Proveedor");
            DropIndex("CR.tab_ProductoPorCompetidor", new[] { "Proveedor_ProveedorId" });
            //DropColumn("CR.tab_ProductoPorCompetidor", "Proveedor_ProveedorId");
        }
        
        public override void Down()
        {
            //AddColumn("CR.tab_ProductoPorCompetidor", "Proveedor_ProveedorId", c => c.Int());
            CreateIndex("CR.tab_ProductoPorCompetidor", "Proveedor_ProveedorId");
            AddForeignKey("CR.tab_ProductoPorCompetidor", "Proveedor_ProveedorId", "CR.tab_Proveedor", "ProveedorId");
        }
    }
}
