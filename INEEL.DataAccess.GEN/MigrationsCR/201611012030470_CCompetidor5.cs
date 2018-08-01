namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CCompetidor5 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_ProductoPorProveedor", "ProveedorId", "CR.tab_Proveedor");
            DropIndex("CR.tab_ProductoPorProveedor", new[] { "ProveedorId" });
            DropColumn("CR.tab_ProductoPorProveedor", "ProveedorId");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_ProductoPorProveedor", "ProveedorId", c => c.Int(nullable: false));
            CreateIndex("CR.tab_ProductoPorProveedor", "ProveedorId");
            AddForeignKey("CR.tab_ProductoPorProveedor", "ProveedorId", "CR.tab_Proveedor", "ProveedorId", cascadeDelete: true);
        }
    }
}
