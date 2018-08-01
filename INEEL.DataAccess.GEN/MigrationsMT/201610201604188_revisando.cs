namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class revisando : DbMigration
    {
        public override void Up()
        {
           /* CreateTable(
                "CR.cat_TipoOrganizacion",
                c => new
                    {
                        TipoOrganizacionId = c.Int(nullable: false, identity: true),
                        Nombre = c.String(nullable: false, maxLength: 50),
                        Descripcion = c.String(maxLength: 300),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TipoOrganizacionId)
                .Index(t => t.Nombre, unique: true);
            
            AddColumn("CR.cat_Empresas", "TipoOrganizacionId", c => c.Int());
            CreateIndex("CR.cat_Empresas", "TipoOrganizacionId");
            AddForeignKey("CR.cat_Empresas", "TipoOrganizacionId", "CR.cat_TipoOrganizacion", "TipoOrganizacionId");*/
        }
        
        public override void Down()
        {
           /* DropForeignKey("CR.cat_Empresas", "TipoOrganizacionId", "CR.cat_TipoOrganizacion");
            DropIndex("CR.cat_TipoOrganizacion", new[] { "Nombre" });
            DropIndex("CR.cat_Empresas", new[] { "TipoOrganizacionId" });
            DropColumn("CR.cat_Empresas", "TipoOrganizacionId");
            DropTable("CR.cat_TipoOrganizacion");*/
        }
    }
}
