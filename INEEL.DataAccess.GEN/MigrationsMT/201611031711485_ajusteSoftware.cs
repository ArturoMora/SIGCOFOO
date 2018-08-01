namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ajusteSoftware : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "MT.AutorSoftware",
                c => new
                    {
                        AutorSoftwareId = c.Long(nullable: false, identity: true),
                        SoftwarePersonalId = c.Int(nullable: false),
                        ClaveAutor = c.String(),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.AutorSoftwareId)
                .ForeignKey("MT.SoftwarePersonal", t => t.SoftwarePersonalId, cascadeDelete: true)
                .Index(t => t.SoftwarePersonalId);
            
            AddColumn("MT.SoftwarePersonal", "NumeroVersion", c => c.Single(nullable: false));
            AddColumn("MT.SoftwarePersonal", "AnioVersion", c => c.Int(nullable: false));
            AddColumn("MT.SoftwarePersonal", "DescripcionFuncional", c => c.String(nullable: false, unicode: false));
            AddColumn("MT.SoftwarePersonal", "PlataformaDesarrollo", c => c.String(nullable: false, unicode: false));
            AddColumn("MT.SoftwarePersonal", "TipoSoftwareId", c => c.Int(nullable: false));
            AlterColumn("CR.cat_Contactos", "Telefono", c => c.String(maxLength: 20));
            AlterColumn("CR.cat_Contactos", "Correo", c => c.String(maxLength: 100));
            AlterColumn("MT.SoftwarePersonal", "Nombre", c => c.String(nullable: false, unicode: false));
            AlterColumn("MT.SoftwarePersonal", "DerechoAutor", c => c.String(unicode: false));
            AlterColumn("MT.SoftwarePersonal", "Comentarios", c => c.String(nullable: false, unicode: false));
            AlterColumn("MT.SoftwarePersonal", "ManualTecnico", c => c.Long(nullable: false));
            AlterColumn("MT.SoftwarePersonal", "TipoAcceso", c => c.Int(nullable: false));
            CreateIndex("MT.SoftwarePersonal", "TipoSoftwareId");
            CreateIndex("MT.SoftwarePersonal", "ManualTecnico");
            CreateIndex("MT.SoftwarePersonal", "TipoAcceso");
            AddForeignKey("MT.SoftwarePersonal", "ManualTecnico", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            AddForeignKey("MT.SoftwarePersonal", "TipoAcceso", "MT.cat_TipoAcceso", "TipoAccesoId", cascadeDelete: true);
            AddForeignKey("MT.SoftwarePersonal", "TipoSoftwareId", "MT.cat_TipoSoftware", "TipoSoftwareId", cascadeDelete: true);
            DropColumn("MT.SoftwarePersonal", "NumVerSw");
            DropColumn("MT.SoftwarePersonal", "AnioVerSw");
            DropColumn("MT.SoftwarePersonal", "Descripcion");
            DropColumn("MT.SoftwarePersonal", "Plataforma");
            DropColumn("MT.SoftwarePersonal", "TipoSw");
            DropColumn("MT.SoftwarePersonal", "Autores");
            DropColumn("MT.SoftwarePersonal", "ManualUsuario");
            DropColumn("MT.SoftwarePersonal", "CodigoFuente");
        }
        
        public override void Down()
        {
            AddColumn("MT.SoftwarePersonal", "CodigoFuente", c => c.String(nullable: false, maxLength: 900));
            AddColumn("MT.SoftwarePersonal", "ManualUsuario", c => c.String(nullable: false, maxLength: 900));
            AddColumn("MT.SoftwarePersonal", "Autores", c => c.String(nullable: false, maxLength: 900));
            AddColumn("MT.SoftwarePersonal", "TipoSw", c => c.Int(nullable: false));
            AddColumn("MT.SoftwarePersonal", "Plataforma", c => c.String(nullable: false, maxLength: 300));
            AddColumn("MT.SoftwarePersonal", "Descripcion", c => c.String(nullable: false, maxLength: 500));
            AddColumn("MT.SoftwarePersonal", "AnioVerSw", c => c.Int(nullable: false));
            AddColumn("MT.SoftwarePersonal", "NumVerSw", c => c.Int(nullable: false));
            DropForeignKey("MT.SoftwarePersonal", "TipoSoftwareId", "MT.cat_TipoSoftware");
            DropForeignKey("MT.SoftwarePersonal", "TipoAcceso", "MT.cat_TipoAcceso");
            DropForeignKey("MT.AutorSoftware", "SoftwarePersonalId", "MT.SoftwarePersonal");
            DropForeignKey("MT.SoftwarePersonal", "ManualTecnico", "GEN.Adjunto");
            DropIndex("MT.AutorSoftware", new[] { "SoftwarePersonalId" });
            DropIndex("MT.SoftwarePersonal", new[] { "TipoAcceso" });
            DropIndex("MT.SoftwarePersonal", new[] { "ManualTecnico" });
            DropIndex("MT.SoftwarePersonal", new[] { "TipoSoftwareId" });
            AlterColumn("MT.SoftwarePersonal", "TipoAcceso", c => c.Boolean(nullable: false));
            AlterColumn("MT.SoftwarePersonal", "ManualTecnico", c => c.String(nullable: false, maxLength: 900));
            AlterColumn("MT.SoftwarePersonal", "Comentarios", c => c.String(nullable: false, maxLength: 300));
            AlterColumn("MT.SoftwarePersonal", "DerechoAutor", c => c.String(nullable: false, maxLength: 300));
            AlterColumn("MT.SoftwarePersonal", "Nombre", c => c.String(nullable: false, maxLength: 300));
            AlterColumn("CR.cat_Contactos", "Correo", c => c.String(maxLength: 150));
            AlterColumn("CR.cat_Contactos", "Telefono", c => c.String(maxLength: 30));
            DropColumn("MT.SoftwarePersonal", "TipoSoftwareId");
            DropColumn("MT.SoftwarePersonal", "PlataformaDesarrollo");
            DropColumn("MT.SoftwarePersonal", "DescripcionFuncional");
            DropColumn("MT.SoftwarePersonal", "AnioVersion");
            DropColumn("MT.SoftwarePersonal", "NumeroVersion");
            DropTable("MT.AutorSoftware");
        }
    }
}
