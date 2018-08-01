namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TamanoCampoCelularContactoMarco2 : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("MT.SoftwarePersonal", "Adjunto", "GEN.Adjunto");
            //DropForeignKey("MT.SoftwarePersonal", "ManualTecnico", "GEN.Adjunto");
            //DropForeignKey("MT.SoftwarePersonal", "ManualUsuario", "GEN.Adjunto");
            //DropForeignKey("MT.AutorSoftware", "SoftwarePersonalId", "MT.SoftwarePersonal");
            //DropForeignKey("MT.SoftwarePersonal", "TipoAcceso", "MT.cat_TipoAcceso");
            //DropForeignKey("MT.SoftwarePersonal", "TipoSoftwareId", "MT.cat_TipoSoftware");
            //DropIndex("MT.SoftwarePersonal", new[] { "TipoSoftwareId" });
            //DropIndex("MT.SoftwarePersonal", new[] { "ManualTecnico" });
            //DropIndex("MT.SoftwarePersonal", new[] { "ManualUsuario" });
            //DropIndex("MT.SoftwarePersonal", new[] { "Adjunto" });
            //DropIndex("MT.SoftwarePersonal", new[] { "TipoAcceso" });
            //DropIndex("MT.AutorSoftware", new[] { "SoftwarePersonalId" });
            //AddColumn("MT.SoftwarePersonal", "NumVerSw", c => c.Int(nullable: false));
            //AddColumn("MT.SoftwarePersonal", "AnioVerSw", c => c.Int(nullable: false));
            //AddColumn("MT.SoftwarePersonal", "Descripcion", c => c.String(nullable: false, maxLength: 500));
            //AddColumn("MT.SoftwarePersonal", "Plataforma", c => c.String(nullable: false, maxLength: 300));
            //AddColumn("MT.SoftwarePersonal", "TipoSw", c => c.Int(nullable: false));
            //AddColumn("MT.SoftwarePersonal", "Autores", c => c.String(nullable: false, maxLength: 900));
            //AddColumn("MT.SoftwarePersonal", "CodigoFuente", c => c.String(nullable: false, maxLength: 900));
            //AlterColumn("CR.cat_Contactos", "Telefono", c => c.String(maxLength: 31));
            //AlterColumn("CR.cat_Contactos", "Correo", c => c.String(maxLength: 151));
            //AlterColumn("MT.SoftwarePersonal", "Nombre", c => c.String(nullable: false, maxLength: 300));
            //AlterColumn("MT.SoftwarePersonal", "DerechoAutor", c => c.String(nullable: false, maxLength: 300));
            //AlterColumn("MT.SoftwarePersonal", "Comentarios", c => c.String(nullable: false, maxLength: 300));
            //AlterColumn("MT.SoftwarePersonal", "ManualTecnico", c => c.String(nullable: false, maxLength: 900));
            //AlterColumn("MT.SoftwarePersonal", "ManualUsuario", c => c.String(nullable: false, maxLength: 900));
            //AlterColumn("MT.SoftwarePersonal", "TipoAcceso", c => c.Boolean(nullable: false));
            //DropColumn("MT.SoftwarePersonal", "NumeroVersion");
            //DropColumn("MT.SoftwarePersonal", "AnioVersion");
            //DropColumn("MT.SoftwarePersonal", "DescripcionFuncional");
            //DropColumn("MT.SoftwarePersonal", "PlataformaDesarrollo");
            //DropColumn("MT.SoftwarePersonal", "TipoSoftwareId");
            //DropColumn("MT.SoftwarePersonal", "Adjunto");
            //DropTable("MT.AutorSoftware");
        }
        
        public override void Down()
        {
            //CreateTable(
            //    "MT.AutorSoftware",
            //    c => new
            //        {
            //            AutorSoftwareId = c.Long(nullable: false, identity: true),
            //            SoftwarePersonalId = c.Int(nullable: false),
            //            ClaveAutor = c.String(),
            //            Estado = c.Boolean(nullable: false),
            //        })
            //    .PrimaryKey(t => t.AutorSoftwareId);
            
            //AddColumn("MT.SoftwarePersonal", "Adjunto", c => c.Long(nullable: false));
            //AddColumn("MT.SoftwarePersonal", "TipoSoftwareId", c => c.Int(nullable: false));
            //AddColumn("MT.SoftwarePersonal", "PlataformaDesarrollo", c => c.String(nullable: false, unicode: false));
            //AddColumn("MT.SoftwarePersonal", "DescripcionFuncional", c => c.String(nullable: false, unicode: false));
            //AddColumn("MT.SoftwarePersonal", "AnioVersion", c => c.Int(nullable: false));
            //AddColumn("MT.SoftwarePersonal", "NumeroVersion", c => c.Single(nullable: false));
            //AlterColumn("MT.SoftwarePersonal", "TipoAcceso", c => c.Int(nullable: false));
            //AlterColumn("MT.SoftwarePersonal", "ManualUsuario", c => c.Long(nullable: false));
            //AlterColumn("MT.SoftwarePersonal", "ManualTecnico", c => c.Long(nullable: false));
            //AlterColumn("MT.SoftwarePersonal", "Comentarios", c => c.String(nullable: false, unicode: false));
            //AlterColumn("MT.SoftwarePersonal", "DerechoAutor", c => c.String(unicode: false));
            //AlterColumn("MT.SoftwarePersonal", "Nombre", c => c.String(nullable: false, unicode: false));
            //AlterColumn("CR.cat_Contactos", "Correo", c => c.String(maxLength: 100));
            //AlterColumn("CR.cat_Contactos", "Telefono", c => c.String(maxLength: 20));
            //DropColumn("MT.SoftwarePersonal", "CodigoFuente");
            //DropColumn("MT.SoftwarePersonal", "Autores");
            //DropColumn("MT.SoftwarePersonal", "TipoSw");
            //DropColumn("MT.SoftwarePersonal", "Plataforma");
            //DropColumn("MT.SoftwarePersonal", "Descripcion");
            //DropColumn("MT.SoftwarePersonal", "AnioVerSw");
            //DropColumn("MT.SoftwarePersonal", "NumVerSw");
            //CreateIndex("MT.AutorSoftware", "SoftwarePersonalId");
            //CreateIndex("MT.SoftwarePersonal", "TipoAcceso");
            //CreateIndex("MT.SoftwarePersonal", "Adjunto");
            //CreateIndex("MT.SoftwarePersonal", "ManualUsuario");
            //CreateIndex("MT.SoftwarePersonal", "ManualTecnico");
            //CreateIndex("MT.SoftwarePersonal", "TipoSoftwareId");
            //AddForeignKey("MT.SoftwarePersonal", "TipoSoftwareId", "MT.cat_TipoSoftware", "TipoSoftwareId", cascadeDelete: true);
            //AddForeignKey("MT.SoftwarePersonal", "TipoAcceso", "MT.cat_TipoAcceso", "TipoAccesoId", cascadeDelete: true);
            //AddForeignKey("MT.AutorSoftware", "SoftwarePersonalId", "MT.SoftwarePersonal", "SoftwarePersonalId", cascadeDelete: true);
            //AddForeignKey("MT.SoftwarePersonal", "ManualUsuario", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            //AddForeignKey("MT.SoftwarePersonal", "ManualTecnico", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
            //AddForeignKey("MT.SoftwarePersonal", "Adjunto", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
        }
    }
}
