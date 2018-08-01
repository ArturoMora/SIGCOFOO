namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CCompetidor6 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_ServicioPorProveedor", "ProveedorId", "CR.tab_Proveedor");
            DropIndex("CR.tab_ServicioPorProveedor", new[] { "ProveedorId" });
            DropColumn("CR.tab_ServicioPorProveedor", "ProveedorId");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_ServicioPorProveedor", "ProveedorId", c => c.Int(nullable: false));
            CreateIndex("CR.tab_ServicioPorProveedor", "ProveedorId");
            AddForeignKey("CR.tab_ServicioPorProveedor", "ProveedorId", "CR.tab_Proveedor", "ProveedorId", cascadeDelete: true);
        }
    }
}
